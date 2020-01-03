'use strict';

const _async = require('async');
const utils = require("../../server/lib/utils");
const redis = require("../../server/lib/datasources/redis");
const randomString = require("randomstring");

module.exports = function (Schedule) {

  const createScheduleModel = {
    title: {
      type: 'string',
      required: true,
      description: "标题"
    },
    description: {
      type: 'string',
      required: true,
      description: "描述 "
    },
    start_time: {
      type: 'string',
      required: true,
      description: "开始时间"
    },
    end_time: {
      type: 'string',
      required: true,
      description: "结束时间 "
    }
  };

  const updateScheduleModel = {
    id: {
      type: 'string',
      required: false,
      description: "日程ID"
    },
    ...createScheduleModel
  }


  function defineCreateScheduleModel(app, cb) {
    var ds = app.datasources.db;
    ds.define('createScheduleModel', createScheduleModel, {
      idInjection: false
    });
    cb(null, app);
  }

  function defineCreateSchedule(app, callback) {
    Schedule.createSchedule = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('createScheduleModel');
        var model = new Model(info);
        model.isValid(function (valid) {
          if (!valid) {
            cb(utils.clientError(model.errors), null);
          } else {
            cb(null, true);
          }
        });
      }

      function createSchedule(ign, cb) {
        console.log(info);
        Schedule.findOrCreate({
          ...info,
          update_time: new Date().toISOString()
        }, (err, logList) => {
          if (err) {
            return cb(utils.clientError('创建日程失败: ' + err), null);
          }
          cb(null, logList);
        })
      }

      _async.waterfall([
        checkModelValid,
        createSchedule
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result)
      })
    }

    Schedule.remoteMethod('createSchedule', {
      http: {
        verb: 'POST'
      },
      description: '创建日程',
      accepts: {
        arg: 'info',
        type: 'createScheduleModel',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'Schedule',
        root: true
      }
    });

    Schedule.beforeRemote('createSchedule', function (ctx, unused, next) {
      ctx.req.body.employee_id = ctx.req.accessToken.userId
      next();
    })

    callback(null, app);
  }


  function defineUpdateScheduleModel(app, cb) {
    var ds = app.datasources.db;
    ds.define('updateScheduleModel', updateScheduleModel, {
      idInjection: false
    });
    cb(null, app);
  }

  function defineUpdateSchedule(app, callback) {
    Schedule.updateSchedule = function (info, cb) {
      function checkModelValid(cb) {
        const Model = app.datasources.db.getModel('updateScheduleModel');
        var model = new Model(info);
        model.isValid(function (valid) {
          if (!valid) {
            cb(utils.clientError(model.errors), null);
          } else {
            cb(null, true);
          }
        });
      }

      function updateSchedule(ign, cb) {
        console.log(info);
        Schedule.upsert({
          ...info,
          update_time: new Date().toISOString()
        }, (err, logList) => {
          if (err) {
            return cb(utils.clientError('编辑日程失败: ' + err), null);
          }
          cb(null, logList);
        })
      }

      _async.waterfall([
        checkModelValid,
        updateSchedule
      ], function (err, result) {
        if (err) {
          return cb(err, null);
        }
        cb(null, result)
      })
    }

    Schedule.remoteMethod('updateSchedule', {
      http: {
        verb: 'PUT'
      },
      description: '编辑日程',
      accepts: {
        arg: 'info',
        type: 'createScheduleModel',
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'Schedule',
        root: true
      }
    });

    Schedule.beforeRemote('updateSchedule', function (ctx, unused, next) {
      ctx.req.body.employee_id = ctx.req.accessToken.userId
      next();
    })
  }

  _async.waterfall([
    Schedule.getApp.bind(Schedule),
    defineCreateScheduleModel,
    defineCreateSchedule,
    defineUpdateScheduleModel,
    defineUpdateSchedule
  ])
};
