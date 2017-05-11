'use strict';

//rules service used for communicating with the rules REST endpoints
angular.module('roles').factory('AdminRolerRulesResolve', ['$resource',
  function ($resource) { 
    var AdminRolerRulesResolve = {};
    AdminRolerRulesResolve.basic = $resource('api/roles/:roleId', {
      roleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
    AdminRolerRulesResolve.rules = $resource('api/role/rules/:roleId', {
      roleId: '@_id'
    }, {
      updateRule: {
        method: 'PUT'
      }
    });
    return AdminRolerRulesResolve;
  }
]);
