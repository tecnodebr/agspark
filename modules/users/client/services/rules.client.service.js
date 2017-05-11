'use strict';

//rules service used for communicating with the rules REST endpoints
angular.module('rules').factory('Rules', ['$resource',
  function ($resource) {
    return $resource('api/rules/:ruleId', {
      ruleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
