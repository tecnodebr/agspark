//Marcas service used to communicate Marcas REST endpoints
(function () {
  'use strict';

  angular
    .module('marcas')
    .factory('MarcasService', MarcasService);

  MarcasService.$inject = ['$resource'];

  function MarcasService($resource) {
    return $resource('api/marcas/:marcaId', {
      marcaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
