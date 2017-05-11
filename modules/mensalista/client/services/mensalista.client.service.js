//Mensalista service used to communicate Mensalista REST endpoints
(function () {
  'use strict';

  angular
    .module('mensalista')
    .factory('MensalistaService', MensalistaService);

  MensalistaService.$inject = ['$resource'];

  function MensalistaService($resource) {
    return $resource('api/mensalista/:mensalistaId', {
      mensalistaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

})();
