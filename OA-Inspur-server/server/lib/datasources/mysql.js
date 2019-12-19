'use strict';


const configPath = process.env.NODE_ENV == 'production' ? 'datasources.production.json' : 'datasources.json';
const config = require('../../' + configPath).mydb;

const mysql = require('mysql'); //调用MySQL模块

const connectConfig = {
  user: config.user,
  password: config.password,
  host: config.host,
  port: config.port,
  database: config.database
};

const connection = mysql.createConnection(connectConfig);

handleConnect(connection);

function handleConnect(connection) {
  //创建一个connection
  connection.connect(function (err) {
    if (err) {
      console.log('Reconnecting：' + new Date());
      setTimeout(handleConnect, 2000); //2秒重连一次
      return;
    }
    console.log('Connected successfully');
  });

  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleConnect();
    } else {
      throw err;
    }
  });
}

function MySql() {
  /**
   * 执行一条sql语句
   * @param {*} sql SQL语句
   * @param {*} params 参数绑定
   * @param {*} callback 
   */
  this.query = function (sql, params, callback) {
    connection.query(sql, params, function (err, res) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, res);
    });
  };

  this.getDataSource = function () {
    return connection;
  }
}

module.exports = new MySql();
