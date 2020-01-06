#!/usr/bin/env node

'use strict';
var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var roles = require('./roles');
var ds = app.datasources.mydb;
// var roles = require('./roles');
// var initData = require('./init-data');

var models = ['LogRecord', 'Orgnization', 'Position', 'Schedule', 'Notification'];
var count = models.length;
models.forEach(function (model) {
  ds.autoupdate(model, function (err) {
    if (err) {
      console.error('migration error:', model);
      throw err;
    }
    count--;
    console.log('model', model, 'updated:', count);
    if (count == 0) {
      // ds.disconnect();
      quit();
    }
  });
});

function quit() {
  console.log('quit....');
  ds.disconnect();

  // How to gracefully quit the app ?
  // app.exit();
}
