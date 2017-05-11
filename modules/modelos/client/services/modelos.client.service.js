//Modelos service used to communicate Modelos REST endpoints
(function () {
  'use strict';

  angular
    .module('modelos')
    .factory('ModelosService', ModelosService);

  ModelosService.$inject = ['$resource'];

  function ModelosService($resource) {
    var modeloApi ={};
    modeloApi.modelo = $resource('api/modelos/:modeloId', {
      modeloId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    modeloApi.marca = $resource('api/marcas/:marcaId', {
      marcaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return modeloApi;
  }
})();
