//Backups service used to communicate Backups REST endpoints
(function () {
  'use strict';

  angular
    .module('backups')
    .factory('BackupsService', BackupsService);

  BackupsService.$inject = ['$resource'];

  function BackupsService($resource) {
    return $resource('api/backups/:backupId', {
      backupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
