'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");
const redis = require("../../server/lib/datasources/redis");
const randomString = require("randomstring");

module.exports = function (Employee) {

  function defineCreateEmployeeModel(app, cb) {
    const CreateEmployeeModel = {
      "username": {
        "type": "string",
        "required": true,
        "description": "用户名"
      },
      "role_id": {
        "type": "number",
        "required": true,
        "description": "角色ID"
      },
      "org_id": {
        "type": "number",
        "required": true,
        "description": "组织ID"
      },
      "password": {
        "type": "string",
        "required": true,
        "description": "密码"
      },
      "en_name": {
        "type": "string",
        "required": false,
        "description": "英文名称"
      },
      "position": {
        "type": "string",
        "required": true,
        "description": "职位"
      },
      "entry_date": {
        "type": "date",
        "required": true,
        "description": "入职日期"
      },
      "office_location": {
        "type": "string",
        "required": true,
        "description": "办公地点"
      },
      "email": {
        "type": "string",
        "required": true,
        "description": "企业邮箱"
      },
      "phone_number": {
        "type": "string",
        "required": true,
        "description": "电话号码"
      },
      "address": {
        "type": "string",
        "required": true,
        "description": "家庭地址"
      },
      "portrait_url": {
        "type": "string",
        "required": true,
        "description": "头像地址",
        "default": "url"
      }
    }
    var ds = app.datasources.db;
    ds.define('CreateEmployeeModel', CreateEmployeeModel, {
      idInjection: false
    });
    cb(null, app);
  }

  function defineCreateEmployee(app, cb) {
    Employee.createEmployee = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('CreateEmployeeModel');
        var m = new Model(info);
        m.isValid(function (valid) {
          if (!valid) {
            cb(m.errors, null);
          } else {
            cb(null, true);
          }
        });
      }

      function checkEmployeeInfo(ign, cb) {
        //校验名字去空格之后是否为空
        const username = info.username;
        if (null == info.username || null == info.username.trim()) {

        }
        const now = Date.now();
        const employee = {
          username: username,
          portrait_url: "url",
          status: "working",
          display: 1,
          create_time: now,
          update_time: now,
          ...info
        };
        cb(null, employee);
      }

      function createEmployee(employee, cb) {
        Employee.create(employee, (err, addRes) => {
          if (err) {
            console.log(err);
            return cb(utils.clientError("新增用户失败", 400), null);
          }
          cb(null, addRes);
        })
      }

      _async.waterfall([
        checkModelValid,
        checkEmployeeInfo,
        createEmployee
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result);
      })
    }
    Employee.remoteMethod('createEmployee', {
      http: {
        verb: 'POST',
      },
      description: "添加员工",
      accepts: {
        arg: 'info',
        type: 'CreateEmployeeModel',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      }
    });
  }

  _async.waterfall([
    Employee.getApp.bind(Employee),
    defineCreateEmployeeModel,
    defineCreateEmployee
  ])

  function defineEmployeeLoginModel(app, cb) {
    const EmployeeLoginModel = {
      "name": {
        "type": "string",
        "required": true,
        "description": "用户名"
      },
      "password": {
        "type": "string",
        "required": true,
        "description": "密码"
      },
    }
    var ds = app.datasources.db;
    ds.define('EmployeeLoginModel', EmployeeLoginModel, {
      idInjection: false
    });
    cb(null, app);
  }


  // 用户登录
  function defineEmployeeLogin(app, cb) {
    Employee.employeeLogin = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('EmployeeLoginModel');
        var m = new Model(info);
        m.isValid(function (valid) {
          if (!valid) {
            cb(m.errors, null);
          } else {
            cb(null, true);
          }
        });
      }

      function checkEmployeeAndPassword(ign, cb) {
        Employee.findOne({
          where: {
            name: info.name,
            password: info.password,
            display: 1
          }
        }, (err, employee) => {
          if (err) {
            console.log(err);
            return cb(utils.clientError("查询用户信息失败", 400), null);
          }
          if (null == employee)
            return cb(utils.clientError("用户名或密码不正确", 400), null);
          delete employee.password;
          cb(null, employee);
        })
      }

      function returnRandomStr(employee, cb) {
        const code = randomString.generate({
          length: 8,
          readable: true
        });
        const key = "oa_user:" + employee.id;
        code = code + key;
        redis.set(key, code, 0, (err, res) => {
          if (err) {
            console.log(err);
            return cb(utils.clientError("登录失败,请重新登录", 400), null);
          }
          cb(null, code);
        })
      }

      _async.waterfall([
        checkModelValid,
        checkEmployeeAndPassword,
        returnRandomStr
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result);
      })
    }

    Employee.remoteMethod('employeeLogin', {
      http: {
        verb: 'POST',
      },
      description: "用户登录",
      accepts: {
        arg: 'info',
        type: 'EmployeeLoginModel',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      }
    });
  }

  _async.waterfall([
    Employee.getApp.bind(Employee),
    defineEmployeeLoginModel,
    defineEmployeeLogin
  ])
};
