#!/usr/bin/env node

'use strict';
var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var roles = require('./roles');
var ds = app.datasources.mydb;
// var roles = require('./roles');
// var initData = require('./init-data');

var models = ['AccessToken', 'EmployeeRole', 'RoleMap', 'ACL', 'Employee'];
var count = models.length;
models.forEach(function (model) {
  ds.automigrate(model, function (err) {
    if (err) {
      console.error('migration error:', model);
      throw err;
    }
    count--;
    console.log('model', model, 'created:', count);
    if (count == 0) {
      // ds.disconnect();
      addForeignKeys();
    }
  });
});

function addForeignKeys() {
  // foreign key is not supported by loopback frame work now
  // ds.defineForeignKey('sitesPlan', 'staffId', 'staff');
  // ds.disconnect();
  roles(app).then(
    quit
  );
  // ds.disconnect();
  // roles(app)
  //  .then(initData(app))
  // .then(quit);
}

function quit() {
  console.log('quit....');
  ds.disconnect();

  // How to gracefully quit the app ?
  // app.exit();
}
