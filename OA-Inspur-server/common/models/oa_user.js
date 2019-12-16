'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");
const redis = require("../../server/lib/datasources/redis");
const randomString = require("randomstring");

module.exports = function (OaUser) {

  function defineCreateOaUserModel(app, cb) {
    const CreateOaUserModel = {
      "name": {
        "type": "string",
        "required": true,
        "description": "用户名"
      },
      "role_id": {
        "type": "number",
        "required": true,
        "description": "角色表id"
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
      "role_id": {
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
      "phone": {
        "type": "string",
        "required": true,
        "description": "电话号码"
      },
      "address": {
        "type": "string",
        "required": true,
        "description": "家庭地址"
      },
      // "head_portrait_url": {
      //     "type": "string",
      //     "required": true,
      //     "description": "头像地址"
      // }
    }
    var ds = app.datasources.db;
    ds.define('CreateOaUserModel', CreateOaUserModel, {
      idInjection: false
    });
    cb(null, app);
  }

  function defineCreateOaUser(app, cb) {
    OaUser.createOaUser = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('CreateOaUserModel');
        var m = new Model(info);
        m.isValid(function (valid) {
          if (!valid) {
            cb(m.errors, null);
          } else {
            cb(null, true);
          }
        });
      }

      function checkUserInfo(ign, cb) {
        //校验名字去空格之后是否为空
        const name = info.name;
        if (null == info.name || null == info.name.trim()) {

        }
        const now = Date.now();
        const oaUser = {
          name: name,
          head_portrait_url: "url",
          status: "working",
          display: 1,
          create_time: now,
          update_time: now,
          ...info
        };
        cb(null, oaUser);
      }

      function createOaUser(oaUser, cb) {
        OaUser.create(oaUser, (err, addRes) => {
          if (err) {
            console.log(err);
            return cb(utils.clientError("新增用户失败", 400), null);
          }
          cb(null, addRes);
        })
      }

      _async.waterfall([
        checkModelValid,
        checkUserInfo,
        createOaUser
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result);
      })
    }
    OaUser.remoteMethod('createOaUser', {
      http: {
        verb: 'POST',
      },
      description: "添加用户",
      accepts: {
        arg: 'info',
        type: 'CreateOaUserModel',
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
    OaUser.getApp.bind(OaUser),
    defineCreateOaUserModel,
    defineCreateOaUser
  ])

  function defineUserLoginModel(app, cb) {
    const UserLoginModel = {
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
    ds.define('UserLoginModel', UserLoginModel, {
      idInjection: false
    });
    cb(null, app);
  }

  function defineUserLogin(app, cb) {
    OaUser.userLogin = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('UserLoginModel');
        var m = new Model(info);
        m.isValid(function (valid) {
          if (!valid) {
            cb(m.errors, null);
          } else {
            cb(null, true);
          }
        });
      }

      function checkUserAndPassword(ign, cb) {
        OaUser.find({
          where: {
            name: info.name,
            password: info.password,
            display: 1
          }
        }, (err, oaUser) => {
          if (err) {
            console.log(err);
            return cb(utils.clientError("查询用户信息失败", 400), null);
          }
          if (null == oaUser)
            return cb(utils.clientError("用户名或密码不正确", 400), null);
          delete oaUser.password;
          cb(null, oaUser);
        })
      }

      function returnRandomStr(oaUser, cb) {
        const code = randomString.generate({
          length: 8,
          readable: true
        });
        const key = "oa_user:" + oaUser.id;
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
        checkUserAndPassword,
        returnRandomStr
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result);
      })
    }
    OaUser.remoteMethod('createOaUser', {
      http: {
        verb: 'POST',
      },
      description: "添加用户",
      accepts: {
        arg: 'info',
        type: 'CreateOaUserModel',
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
    OaUser.getApp.bind(OaUser),
    defineUserLoginModel,
    defineUserLogin
  ])
};
