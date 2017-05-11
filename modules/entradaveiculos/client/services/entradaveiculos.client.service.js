//Entradaveiculos service used to communicate Entradaveiculos REST endpoints
(function () {
  'use strict';

  angular
    .module('entradaveiculos')
    .factory('EntradaveiculosService', EntradaveiculosService);

  EntradaveiculosService.$inject = ['$resource'];

  function EntradaveiculosService($resource) {
    var EntradaVeiculoApi = {};
    EntradaVeiculoApi.Entrada = $resource('api/entradaveiculos/:entradaveiculoId', {
        entradaveiculoId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
      EntradaVeiculoApi.Permanencia = $resource('api/saidaveiculos/:entradaveiculoId/permanencia', {
          entradaveiculoId: '@_id'
        });
      EntradaVeiculoApi.Saida = $resource('api/saidaveiculos/:entradaveiculoId/:tabelaprecoId', {
          entradaveiculoId: '@_id',
          tabelaprecoId: '@tabelaprecoId'
        });

    return EntradaVeiculoApi;
  }
})();
