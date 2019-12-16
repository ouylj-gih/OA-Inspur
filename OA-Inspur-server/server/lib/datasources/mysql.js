'use strict';

/**
 * PostgreSql数据源
 */

const DataSource = require('loopback-datasource-juggler').DataSource;
const configPath = process.env.NODE_ENV == 'production' ? 'datasources.production.json' : 'datasources.json';
const config = require('../../' + configPath).mydb;
const mys = require('mysql');
const conn = mys.createConnection();

const dataSource = new DataSource({
  connector: require('mysql'),
  username: config.user,
  password: config.password,
  host: config.host,
  port: config.port,
  database: config.database
});

function MySql() {
  /**
   * 执行一条sql语句
   * @param {*} sql SQL语句
   * @param {*} params 参数绑定
   * @param {*} callback 
   */
  this.exec = function (sql, params, callback) {
    dataSource.connector.execute(sql, params, function (err, res) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, res);
    });
  };

  /**
   * 执行一条查询sql语句
   * @param {*} sql SQL语句
   * @param {*} params 参数绑定
   * @param {*} callback 
   */
  this.query = function (sql, params, callback) {
    this.execute(sql, params, callback);
  };

  this.getDataSource = function () {
    return dataSource;
  }
}

module.exports = new MySql();
