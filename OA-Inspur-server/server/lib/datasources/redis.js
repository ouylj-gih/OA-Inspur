'use strict';

/**
 * Redis数据源
 */

const DataSource = require('loopback-datasource-juggler').DataSource;
const conf = require('../../config.json');
const config = process.env.NODE_ENV == 'production' ? conf.redis_prod : conf.redis;

const dataSource = new DataSource({
  connector: require('loopback-connector-kv-redis'),
  host: config.host,
  port: config.port,
  db: config.db
});

function isBuffer(str) {
  return str && typeof str === "object" && Buffer.isBuffer(str);
}

function Redis() {
  /**
   * 执行一个Redis命令
   * @param {*} command string redis命令
   * @param {*} args array 按顺序写入操作参数
   * @param {*} callback 
   */
  this.command = function (command, args, callback) {
    dataSource.connector.execute(command, args, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, result.toString());
    });
  }

  this.set = function (key, value, callback) {
    dataSource.connector.execute('set', [key, value], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  };

  this.set_expire = function (key, value, expire, callback) {
    dataSource.connector.execute('set', [key, value], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      if (!isNaN(expire) && expire > 0) {
        dataSource.connector.execute('expire', [key, parseInt(expire)], (err, res) => {});
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  };

  this.get = function (key, callback) {
    dataSource.connector.execute('get', [key], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  };

  this.exists = function (key, callback) {
    dataSource.connector.execute('exists', [key], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  };

  this.hset = function (key, field, value, callback) {
    dataSource.connector.execute('hset', [key, field, value], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  };

  this.hget = function (key, field, callback) {
    dataSource.connector.execute('hget', [key, field], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  };

  this.hgetall = function (key, callback) {
    dataSource.connector.execute('hgetall', [key], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  }

  this.del = function (key, callback) {
    dataSource.connector.execute('del', [key], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  };

  this.hexists = function (key, field, callback) {
    dataSource.connector.execute('hexists', [key, field], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  }

  this.getset = function (key, value, callback) {
    dataSource.connector.execute('getset', [key, value], function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, isBuffer(result) ? result.toString() : result);
    });
  }
}

module.exports = new Redis();
