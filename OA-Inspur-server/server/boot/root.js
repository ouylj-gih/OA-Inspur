// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const path = require('path');

module.exports = function (server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  router.get('/avatar', (req, res) => {
    res.sendFile(path.join(__dirname, '/../storage/portrait/defaultUser.jpg'));
  });
  // server.use('/static', express.static('public'));
  server.use('/static', (req, res) => {
    res.sendFile(path.join(__dirname, '/../storage')+req.originalUrl.replace(/\/static/g, ''));
  });
  server.use(router);
};
