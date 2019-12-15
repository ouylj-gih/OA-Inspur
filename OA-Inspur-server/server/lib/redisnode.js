var db = {};
var conf = require('../config.json');
var redis_conf = process.env.NODE_ENV == 'production' ? conf.redis_prod : conf.redis;
var redis = require('redis'),
    RDS_PORT = redis_conf.port,        //端口号
    RDS_HOST = redis_conf.host,    //服务器IP
    // RDS_PWD = redis_conf.pwd,    //密码 
    RDS_DB = redis_conf.db,
    RDS_OPTS = {},            //设置项
    client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
var debug = require('debug')('redisnode');

// client.auth(RDS_PWD,function(){
// debug('通过认证');
// });
client.select(RDS_DB, function (err) {
    if (err) {
        return false;
    } else {
        debug('connect success db:' + RDS_DB);
    }
});

client.on('connect', function () {
    debug('connect');
});

client.on('ready', function (err) {
    debug('ready');
});

/** 
 * 添加string类型的数据 
 * @param key 键 
 * @params value 值  
 * @params expire (过期时间,单位秒;可为空，为空表示不过期) 
 * @param callBack(err,result) 
 */
db.set = function (key, value, expire, callback) {

    client.set(key, value, function (err, result) {

        if (err) {
            debug(err);
            callback(err, null);
            return;
        }

        if (!isNaN(expire) && expire > 0) {
            client.expire(key, parseInt(expire));
        }

        callback(null, result)
    })
}

/** 
 * 查询string类型的数据 
 * @param key 键 
 * @param callBack(err,result) 
 */
db.get = function (key, callback) {

    client.get(key, function (err, result) {

        if (err) {
            debug(err);
            callback(err, null)
            return;
        }

        callback(null, result);
    });
}

db.getset = client.getset.bind(client);

db.del = client.del.bind(client);

db.expire = client.expire.bind(client);

db.lpush = client.lpush.bind(client);

module.exports = db; 
