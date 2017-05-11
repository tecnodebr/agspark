'use strict';

// Setting up route
angular.module('userrules').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('userrules', {
        abstract: true,
        url: '/userrules',
        template: '<ui-view/>'
      })
      .state('userrules-edit', {
        url: '/userrules/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user-rules.client.view.html',
        controller: 'UserRulesController',
        resolve: {
          adminUserRulesResolve: ['$stateParams', 'AdminUserRules', function ($stateParams, AdminUserRules) {
            var AdminUserRulesResults = { Admin : [], Rules : [] };

            AdminUserRulesResults.Admin = AdminUserRules.Admin.get({
              userId: $stateParams.userId
            });

            AdminUserRulesResults.Rules = AdminUserRules.Rules.query();

            return AdminUserRulesResults;
          }],
        }
      });
  }
]);
