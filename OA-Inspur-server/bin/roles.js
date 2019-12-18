'use strict';

const waterfall = require('async').waterfall;
module.exports = function (app) {

  // var defer = Q.defer();
  var Role = app.models.Role;
  var Employee = app.models.Employee;
  var RoleMapping = app.models.RoleMapping;

  function setAdmin() {
    return new Promise(function (resolve, reject) {
      function createAdminUser(cb) {
        Employee.findOrCreate({
          where: {
            username: 'superAdmin',
          },
        }, {
          // {"username":"superAdmin","password":"MOvk8SS9MZA1Ca5z58GwcYZ3sH9XL2eC"}
          username: 'superAdmin',
          org_id: '0',
          position_id: '0',
          entry_date: '2019-12-18T07:25:25.927Z',
          office_location: 'office_location',
          phone_number: '13999999999',
          address: 'address',
          password: 'MOvk8SS9MZA1Ca5z58GwcYZ3sH9XL2eC',
          email: 'superAdmin@icowallet.net',
        }, function (err, user) {
          cb(err, user);
        });
      }

      function createAdminRole(admin, cb) {
        var adminRole = {
          name: 'admin'
        };
        Role.findOrCreate({
            where: adminRole,
          },
          adminRole,
          function (err, role) {
            cb(err, admin, role);
          });
      }

      function createAdminRoleMapping(admin, role, cb) {
        var adminMapping = {
          roleId: role.id,
          principalType: RoleMapping.USER,
          principalId: admin.id,
        };
        // make admin
        RoleMapping.findOrCreate({
            where: adminMapping,
          },
          adminMapping,
          function (err, principal) {
            cb(err, principal);
          });
      }

      waterfall([
        createAdminUser,
        createAdminRole,
        createAdminRoleMapping,
      ], function (err, p) {
        if (err) {
          return reject(err);
        }
        resolve(null);
      });
    });
  }

  /*
  function setEndUser() {
    return new Promise(function(resolve, reject) {
      var enduserRole = { name: 'enduser' };
      Role.findOrCreate(enduserRole, function (err, user) {
        if (err) throw err;
        resolve(true);
      });
    });
  }
  */

  return Promise.all([
    setAdmin(),
  ]);
};
