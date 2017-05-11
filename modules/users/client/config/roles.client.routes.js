'use strict';

// Setting up route
angular.module('roles').config(['$stateProvider',
  function ($stateProvider) {
    // Roles state routing
    $stateProvider
      .state('roles', {
        abstract: true,
        url: '/roles',
        template: '<ui-view/>'
      })
      .state('roles.list', {
        url: '',
        templateUrl: 'modules/users/client/views/roles/list-roles.client.view.html'
      })
      .state('roles.create', {
        url: '/create',
        templateUrl: 'modules/users/client/views/roles/create-roles.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('roles.view', {
        url: '/:roleId',
        templateUrl: 'modules/users/client/views/roles/view-roles.client.view.html'
      })
      .state('roles.read', {
        url: '/:roleId',
        templateUrl: 'modules/users/client/views/roles/view-roles.client.view.html'
      })
      .state('roles.edit', {
        url: '/:roleId/edit',
        templateUrl: 'modules/users/client/views/roles/edit-roles.client.view.html',
        data: {
          roles: ['admin']
        }
      }).state('roles.associate', {
        url: '/:roleId/rules',
        templateUrl: 'modules/users/client/views/roles/associate-role-rules.client.view.html',

        resolve: {
          AdminRolerRulesResolve: ['$stateParams', 'AdminRolerRulesResolve', function ($stateParams, AdminRolerRulesResolve) {

            var adminRolerRulesResolve = { basic : [], rules : {} };

            adminRolerRulesResolve.basic = AdminRolerRulesResolve.basic.get({
              roleId: $stateParams.roleId
            });

            adminRolerRulesResolve.rules = AdminRolerRulesResolve.rules;

            return adminRolerRulesResolve;
          }],
        }
      }); 
  }
]);
