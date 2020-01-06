'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");

module.exports = function(Notification) {
  const createNotificationModel = {
    title: {
      type: 'string',
      required: true,
      description: "标题"
    },
    detail: {
      type: 'string',
      required: true,
      description: "详情 "
    },
    imgUrl: {
      type: 'string',
      description: "图片url"
    }
  };

  const updateNotificationModel = {
    id: {
      type: 'string',
      required: true,
      description: "通知ID"
    },
    ...createNotificationModel
  }


  function defineCreateNotificationModel(app, cb) {
    var ds = app.datasources.db;
    ds.define('createNotificationModel', createNotificationModel, {
      idInjection: false
    });
    cb(null, app);
  }

  function defineCreateNotification(app, callback) {
    Notification.createNotification = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('createNotificationModel');
        var model = new Model(info);
        model.isValid(function (valid) {
          if (!valid) {
            cb(utils.clientError(model.errors), null);
          } else {
            cb(null, true);
          }
        });
      }

      function createNotification(ign, cb) {
        Notification.findOrCreate({
          ...info,
          update_time: new Date().toISOString()
        }, (err, logList) => {
          if (err) {
            return cb(utils.clientError('创建通知失败: ' + err), null);
          }
          cb(null, logList);
        })
      }

      _async.waterfall([
        checkModelValid,
        createNotification
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result)
      })
    }

    Notification.remoteMethod('createNotification', {
      http: {
        verb: 'POST'
      },
      description: '创建通知',
      accepts: {
        arg: 'info',
        type: 'createNotificationModel',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'Notification',
        root: true
      }
    });

    Notification.beforeRemote('createNotification', function (ctx, unused, next) {
      ctx.req.body.publisher_id = ctx.req.accessToken.userId
      next();
    })

    callback(null, app);
  }


  function defineUpdateNotificationModel(app, cb) {
    var ds = app.datasources.db;
    ds.define('updateNotificationModel', updateNotificationModel, {
      idInjection: false
    });
    cb(null, app);
  }

  function defineUpdateNotification(app, callback) {
    Notification.updateNotification = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('updateNotificationModel');
        var model = new Model(info);
        model.isValid(function (valid) {
          if (!valid) {
            cb(utils.clientError(model.errors), null);
          } else {
            cb(null, true);
          }
        });
      }

      function updateNotification(ign, cb) {
        Notification.upsert({
          ...info,
          update_time: new Date().toISOString()
        }, (err, logList) => {
          if (err) {
            return cb(utils.clientError('编辑通知失败: ' + err), null);
          }
          cb(null, logList);
        })
      }

      _async.waterfall([
        checkModelValid,
        updateNotification
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result)
      })
    }

    Notification.remoteMethod('updateNotification', {
      http: {
        verb: 'POST'
      },
      description: '编辑通知',
      accepts: {
        arg: 'info',
        type: 'updateNotificationModel',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'Notification',
        root: true
      }
    });

    Notification.beforeRemote('updateNotification', function (ctx, unused, next) {
      ctx.req.body.publisher_id = ctx.req.accessToken.userId
      next();
    })
  }

  _async.waterfall([
    Notification.getApp.bind(Notification),
    defineCreateNotificationModel,
    defineCreateNotification,
    defineUpdateNotificationModel,
    defineUpdateNotification
  ])
};
