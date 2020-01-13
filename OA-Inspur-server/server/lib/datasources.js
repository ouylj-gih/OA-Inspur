'use strict';

const mysql = require('./datasources/mysql.js');
const redis = require('./datasources/redis.js');

let datasources = {};
datasources.mysql = mysql;
datasources.redis = redis;

module.exports = Object.assign(datasources, {
  files:{
    connector:{
      getFilename: function(uploadingFile, req, res) {
        // return Math.random().toString().substr(2) + '.jpg';
        let fileName = uploadingFile.name.replace(/\s+/g, '-').toLowerCase();
        let fileObj = path.parse(fileName);
        return fileObj.name + Date.now() + fileObj.ext;
      }
    }
  }
});
