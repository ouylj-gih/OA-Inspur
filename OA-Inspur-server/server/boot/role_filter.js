'use strict';

const utils = require('../lib/utils.js');
const redis = require("../lib/datasources/redis");

module.exports = function (app) {
    var Role = app.models.Role;

    const ignore_interception_method = ['userLogin'];

    Role.registerResolver('$everyone', function (role, context, cb) {
        //判断是否为需要登录状态的方法
        const method = context.method;
        const need_interception = utils.in_array(method, ignore_interception_method);

        if (!need_interception) {
            //检测是否登录
            let data = context.remotingContext.req.body;
            if (!data.hasOwnProperty('token')) {
                return callback(utils.clientError('未登录', 400), null);
            }
            const token = data.token;
            const key = token.substring(8);
            key = "oa_user:" + key;
            redis.get(key, (err, res) => {
                if (err) {
                    console.log(err);
                    return cb(utils.clientError("查询登录状态失败", 400), null);
                }
                if (!res || res != token) {
                    return cb(utils.clientError("尚未登录,请登录", 400), null);
                } else {
                    cb(null, true);
                }
            })
        } else {
            cb(null, true);
        }

    });

}