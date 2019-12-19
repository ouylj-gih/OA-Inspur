'use strict';

const mysql = require('./datasources/mysql.js');
const redis = require('./datasources/redis.js');

let datasources = {};
datasources.mysql = mysql;
datasources.redis = redis;

module.exports = datasources;
