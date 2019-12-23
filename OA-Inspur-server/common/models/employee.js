'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");
const redis = require("../../server/lib/datasources/redis");
const randomString = require("randomstring");

module.exports = function (Employee) {
  function defineGetContacts(app, cb) {

    const getContactsModel = {
      "pageSize": {
        "type": "number",
        "required": true,
        "description": "每页数量"
      },
      "pageNumber": {
        "type": "number",
        "required": true,
        "description": "当前页码"
      }
    }
    var ds = app.datasources.db;
    ds.define('getContactsModel', getContactsModel, {
      idInjection: false
    });

    Employee.getContacts = function (msg, cb) {
      console.log(msg)
      Employee.find({
        where: {
          display: 1
        },
        limit: Number(msg.pageSize),
        offset: msg.pageNumber * msg.pageSize,
        include: ["orgnization", "position"]
      }, function (err, res) {
        if (err) {
          return cb(utils.clientError(err, 400), null)
        }
        cb(null, res)
      })
    }

    Employee.remoteMethod('getContacts', {
      http: {
        verb: 'GET',
      },
      description: "获取通讯录",
      accepts: {
        type: "getContactsModel",
        arg: "info",
        http: {
          source: 'query'
        }
      },
      returns: {
        arg: 'result',
        type: 'array',
        root: true
      }
    });
  }

  _async.waterfall([
    Employee.getApp.bind(Employee),
    defineGetContacts
  ])
}
