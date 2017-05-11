'use strict';

// Setting up route
angular.module('rules').config(['$stateProvider',
  function ($stateProvider) {
    // Rules state routing
    $stateProvider
      .state('rules', {
        abstract: true,
        url: '/rules',
        template: '<ui-view/>'
      })
      .state('rules.list', {
        url: '',
        templateUrl: 'modules/users/client/views/rules/list-rules.client.view.html'
      })
      .state('rules.create', {
        url: '/create',
        templateUrl: 'modules/users/client/views/rules/create-rules.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('rules.view', {
        url: '/:ruleId',
        templateUrl: 'modules/users/client/views/rules/view-rules.client.view.html'
      })
      .state('rules.read', {
        url: '/:ruleId',
        templateUrl: 'modules/users/client/views/rules/view-rules.client.view.html'
      })
      .state('rules.edit', {
        url: '/:ruleId/edit',
        templateUrl: 'modules/users/client/views/rules/edit-rules.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
