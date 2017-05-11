(function () {
  'use strict';

  angular
    .module('backups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backups', {
        abstract: true,
        url: '/backups',
        template: '<ui-view/>'
      })
      .state('backups.list', {
        url: '',
        templateUrl: 'modules/backups/client/views/list-backups.client.view.html',
        controller: 'BackupsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Backups List'
        }
      })
      .state('backups.create', {
        url: '/create',
        templateUrl: 'modules/backups/client/views/form-backup.client.view.html',
        controller: 'BackupsController',
        controllerAs: 'vm',
        resolve: {
          backupResolve: newBackup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Backups Create'
        }
      })
      .state('backups.edit', {
        url: '/:backupId/edit',
        templateUrl: 'modules/backups/client/views/form-backup.client.view.html',
        controller: 'BackupsController',
        controllerAs: 'vm',
        resolve: {
          backupResolve: getBackup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Backup {{ backupResolve.name }}'
        }
      })
      .state('backups.view', {
        url: '/:backupId',
        templateUrl: 'modules/backups/client/views/view-backup.client.view.html',
        controller: 'BackupsController',
        controllerAs: 'vm',
        resolve: {
          backupResolve: getBackup
        },
        data:{
          pageTitle: 'Backup {{ articleResolve.name }}'
        }
      });
  }

  getBackup.$inject = ['$stateParams', 'BackupsService'];

  function getBackup($stateParams, BackupsService) {
    return BackupsService.get({
      backupId: $stateParams.backupId
    }).$promise;
  }

  newBackup.$inject = ['BackupsService'];

  function newBackup(BackupsService) {
    return new BackupsService();
  }
})();
