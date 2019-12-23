'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");
const redis = require("../../server/lib/datasources/redis");
const randomString = require("randomstring");

module.exports = function (Employee) {
  function defineGetContactsModel(app, cb) {
    const getContactsModel = {
      pageSize: {
        type: 'number',
        required: true,
        description: "每页数量"
      },
      pageNumber: {
        type: 'number',
        required: true,
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
        if (!info.pageSize) {
          info.pageSize = 10;
        }
        if (!info.pageNumber) {
          info.pageNumber = 0;
        }
        Employee.find({
          where: {
            display: 1
          },
          order: 'id desc',
          limit: Number(info.pageSize),
          offset: info.pageNumber * info.pageSize,
          include: ["orgnization", "position"]
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
