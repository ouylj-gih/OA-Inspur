'use strict';

const waterfall = require('async').waterfall;
module.exports = function (app) {

  // var defer = Q.defer();
  var Employee = app.models.Employee;
  var EmployeeRole = app.models.EmployeeRole;
  var RoleMap = app.models.RoleMap;

  function setAdmin() {
    return new Promise(function (resolve, reject) {
      function createSuperAdminUser(cb) {
        Employee.findOrCreate({
          where: {
            username: 'superAdmin1',
          },
        }, {
          // {"username":"superAdmin1","password":"MOvk8SS9MZA1Ca5z58GwcYZ3sH9XL2eC"}
          username: 'superAdmin1',
          email: 'superAdmin1@inspurworld.com',
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
          name: 'superAdmin',
          description: "超级管理员"
        };
        EmployeeRole.findOrCreate({
            where: adminRole,
          },
          adminRole,
          function (err, role) {
            cb(err, admin, role);
          });
      }

      function createAdminRoleMap(admin, role, cb) {
        var adminMapping = {
          roleId: role.id,
          principalType: RoleMap.USER,
          principalId: admin.id,
        };
        // make admin
        RoleMap.findOrCreate({
            where: adminMapping,
          },
          adminMapping,
          function (err, principal) {
            cb(err, admin, principal);
          });
      }

      function createOtherRoles(admin, roleMapping, cb) {
        const roles = [{
            name: 'departmentAdmin',
            description: '部门管理员'
          },
          {
            name: 'personnelAdmin',
            description: '人事管理员'
          },
          {
            name: 'staffAdmin',
            description: '员工管理员'
          },
          {
            name: 'ITAdmin',
            description: 'IT管理员'
          },
          {
            name: 'user',
            description: '普通用户'
          },
        ]
        EmployeeRole.create(roles, function (err, role) {
          cb(err, role);
        })
      }

      waterfall([
        createSuperAdminUser,
        createAdminRole,
        createAdminRoleMap,
        createOtherRoles,
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
      EmployeeRole.findOrCreate(enduserRole, function (err, user) {
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
