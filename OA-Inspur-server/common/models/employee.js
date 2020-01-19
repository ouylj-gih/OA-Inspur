'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");
const _ = require('lodash');

module.exports = function (Employee) {
  const phoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
  const emailReg = /^([A-Za-z0-9_\-\.])+\@(inspurworld.com)$/;
  Employee.validatesFormatOf('email', {
    with: emailReg,
    message: '请输入正确的邮箱地址'
  });
  Employee.validatesUniquenessOf('email', {
    message: '邮箱已存在'
  });
  Employee.validatesUniquenessOf('username', {
    message: '用户名已存在'
  });
  Employee.validatesFormatOf('phone_number', {
    with: phoneReg,
    message: '请输入正确的电话号码'
  });

  function defineGetContactsModel(app, callback) {
    const getContactsModel = {
      pageSize: {
        type: 'number',
        required: false,
        description: "每页数量"
      },
      pageNumber: {
        type: 'number',
        required: false,
        description: "当前页码 "
      }
    };

    var ds = app.datasources.db;
    ds.define('getContactsModel', getContactsModel, {
      idInjection: false
    });
    callback(null, app);
  }

  function defineGetContacts(app, callback) {
    Employee.getContacts = function (pagination, search, orgId, rb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('getContactsModel');
        var model = new Model(pagination);
        model.isValid(function (valid) {
          if (!valid) {
            cb(utils.clientError(model.errors), null);
          } else {
            cb(null, true);
          }
        });
      }

      function getContacts(ign, cb) {
        const paginator = {};
        const baseParams = {
          and: [{
              display: 1
            },
            {
              id: {
                neq: 1
              }
            }
          ]
        };
        var searchParams = _.cloneDeep(baseParams);
        const likeParams = {
          or: [{
              username: {
                like: `%${search}%`
              }
            },
            {
              phone_number: {
                like: `%${search}%`
              }
            },
            {
              en_name: {
                like: `%${search}%`
              }
            },
            {
              address: {
                like: `%${search}%`
              }
            },
          ]
        }

        if (pagination && pagination.hasOwnProperty('pageSize') && pagination.hasOwnProperty('pageNumber')) {
          paginator["limit"] = Number(pagination.pageSize);
          paginator["offset"] = pagination.pageNumber * pagination.pageSize;
        }
        if (search) {
          searchParams.and.push(likeParams);
        }
        if (orgId) {
          searchParams.and.push({
            org_id: orgId
          })
        }

        // 查询条件
        const params = {
          where: searchParams,
          fields: {
            display: false,
            create_time: false,
            update_time: false,
            realm: false,
            emailVerified: false,
          },
          order: 'id asc',
          include: [{
            relation: "orgnization",
            scope: { // fetch 1st "page" with 5 entries in it
              fields: {
                org_name: true,
                office_location: true,
                parent_org_id: true
              }
            }
          }, {
            relation: "position",
            scope: { // fetch 1st "page" with 5 entries in it
              fields: {
                name: true
              }
            }
          }, {
            relation: "office",
            scope: { // fetch 1st "page" with 5 entries in it
              fields: {
                name: true,
                location: true
              }
            }
          }],
          ...paginator
        };
        Employee.find(params, (err, logList) => {
          if (err) {
            return cb(utils.clientError('查询通讯录错误: ' + err), null);
          }
          Employee.count(searchParams, (err, count) => {
            if (err) {
              return cb(utils.clientError('查询通讯录错误: ' + err), null);
            }
            cb(null, {
              totalCount: count,
              employee: logList,
            });
          })
        })
      }

      _async.waterfall([
        checkModelValid,
        getContacts
      ], function (err, result) {
        if (err) {
          return rb(err, null);
        }
        rb(null, result)
      })
    }

    Employee.remoteMethod('getContacts', {
      http: {
        verb: 'GET'
      },
      description: '获取通讯录',
      accepts: [{
        arg: 'pagination',
        type: 'getContactsModel',
        http: {
          source: 'query'
        }
      }, {
        arg: 'search',
        type: 'string',
        http: {
          source: 'query'
        }
      }, {
        arg: 'org_id',
        type: 'string',
        http: {
          source: 'query'
        }
      }],
      returns: {
        arg: 'result',
        type: 'any',
        root: true
      }
    });

    callback(null, app);
  }

  function defineUpdateInfoModel(app, callback) {
    const updateInfoModel = {
      en_name: {
        type: 'string',
        required: false,
        description: "英文名"
      },
      status: {
        type: 'string',
        required: false,
        description: "状态: working:上班中; resting:休假中"
      }
    };

    var ds = app.datasources.db;
    ds.define('updateInfoModel', updateInfoModel, {
      idInjection: false
    });
    callback(null, app);
  }

  function defineUpdateInfo(app) {
    Employee.updateInfo = function (info, rb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('updateInfoModel');
        var model = new Model(info);
        model.isValid(function (valid) {
          if (!valid) {
            cb(utils.clientError(model.errors), null);
          } else {
            cb(null, true);
          }
        });
      }

      function updateInfo(ign, cb) {
        const params = {};
        if (info.en_name) {
          params['en_name'] = info.en_name;
        }
        if (info.status) {
          params['status'] = info.status;
        }
        Employee.updateAll({
          id: info.id
        }, {
          ...params
        }, (err, logList) => {
          if (err) {
            return cb(utils.clientError('修改失败: ' + err), null);
          }
          cb(null, logList);
        })
      }

      _async.waterfall([
        checkModelValid,
        updateInfo
      ], function (err, result) {
        if (err) {
          return rb(err, null);
        }
        rb(null, result)
      })
    }

    Employee.remoteMethod('updateInfo', {
      http: {
        verb: 'POST'
      },
      description: '修改英文名/状态',
      accepts: {
        arg: 'info',
        type: 'updateInfoModel',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'Employee',
        root: true
      }
    });

    Employee.beforeRemote('updateInfo', function (ctx, unused, next) {
      ctx.req.body.id = ctx.req.accessToken.userId
      next();
    })
  }

  _async.waterfall([
    Employee.getApp.bind(Employee),
    defineGetContactsModel,
    defineGetContacts,
    defineUpdateInfoModel,
    defineUpdateInfo
  ])
};
