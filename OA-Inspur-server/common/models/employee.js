'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");
const redis = require("../../server/lib/datasources/redis");
const randomString = require("randomstring");

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

  function defineGetContactsModel(app, cb) {
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
    cb(null, app);
  }

  function defineGetContacts(app, cb) {
    Employee.getContacts = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('getContactsModel');
        var model = new Model(info);
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
        if (info && info.hasOwnProperty('pageSize') && info.hasOwnProperty('pageNumber')) {
          paginator["limit"] = Number(info.pageSize);
          paginator["offset"] = info.pageNumber * info.pageSize;
        }
        Employee.find({
          where: {
            and: [{
              display: 1
            }, {
              id: {
                neq: 1
              }
            }]
          },
          fields: {
            display: false,
            create_time: false,
            update_time: false,
            realm: false,
            emailVerified: false,
          },
          order: 'id desc',
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
          }],
          ...paginator
        }, (err, logList) => {
          if (err) {
            return cb(utils.clientError('查询通讯录错误: ' + err), null);
          }
          cb(null, logList);
        })
      }

      _async.waterfall([
        checkModelValid,
        getContacts
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result)
      })
    }

    Employee.remoteMethod('getContacts', {
      http: {
        verb: 'GET'
      },
      description: '获取通讯录',
      accepts: {
        arg: 'info',
        type: 'getContactsModel',
        http: {
          source: 'query'
        }
      },
      returns: {
        arg: 'result',
        type: 'Employee',
        root: true
      }
    });
  }

  _async.waterfall([
    Employee.getApp.bind(Employee),
    defineGetContactsModel,
    defineGetContacts
  ])
};
