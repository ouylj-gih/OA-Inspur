'use strict';

const mysql = require('./datasources/mysql.js');
const redis = require('./datasources/redis.js');

let datasources = {};
datasources.mysql = mysql;
datasources.redis = redis;

module.exports = Object.assign(datasources, {
  getFilename: function(fileInfo) {
    let fileName = fileInfo.name.replace(/\s+/g, '-').toLowerCase();
    let fileObj = path.parse(fileName);
    return fileObj.name + Date.now() + fileObj.ext;
  },
});
