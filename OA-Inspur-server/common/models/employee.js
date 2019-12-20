'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");
const redis = require("../../server/lib/datasources/redis");
const randomString = require("randomstring");

module.exports = function (Employee) {
  function defineGetContacts() {
    Employee.getContacts = function (msg, cb) {
      Employee.find({
        where: {
          display: 1
        },
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
        type: "object",
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'array',
        root: true
      }
    });
  }

  defineGetContacts();
}
