'use strict';

const psql = require('./datasources/postgreSql.js');
const redis = require('./datasources/redis.js');

let datasources = {};
datasources.psql = psql;
datasources.redis = redis;

module.exports = datasources;