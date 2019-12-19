'use strict';

const waterfall = require('async').waterfall;
module.exports = function (app) {

  // var defer = Q.defer();
  var Employee = app.models.Employee;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  function setAdmin() {
    return new Promise(function (resolve, reject) {
      function createAdminUser(cb) {
        Employee.findOrCreate({
          where: {
            username: 'superAdmin1',
          },
        }, {
          // {"username":"superAdmin1","password":"MOvk8SS9MZA1Ca5z58GwcYZ3sH9XL2eC"}
          username: 'superAdmin1',
          email: 'superAdmin1@icowallet.net',
          password: 'MOvk8SS9MZA1Ca5z58GwcYZ3sH9XL2eC',
          org_id: '0',
          position_id: '0',
          entry_date: '2019-12-18T07:25:25.927Z',
          office_location: 'office_location',
          phone_number: '13999999999',
          address: 'address',
        }, function (err, user) {
          cb(err, user);
        });
      }

      function createAdminRole(admin, cb) {
        var adminRole = {
          name: 'superAdmin'
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
