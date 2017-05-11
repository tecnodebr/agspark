'use strict';


angular.module('userrules').factory('AdminUserRules', ['$resource',
  function ($resource) {

    var AdminUserRules = {};

    AdminUserRules.Admin = $resource('api/userrules/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    AdminUserRules.Rules = $resource('api/rules', {
    }, {
      update: {
        method: 'PUT'
      }
    });
    return AdminUserRules;
  }
]);
