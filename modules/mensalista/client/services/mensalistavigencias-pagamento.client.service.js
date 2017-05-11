//Mensalista service used to communicate Mensalista REST endpoints
(function () {
  'use strict';

  angular
    .module('mensalistavigenciaspagamento')
    .factory('MensalistaVigenciasPagamentoService', MensalistaVigenciasPagamentoService);

  MensalistaVigenciasPagamentoService.$inject = ['$resource'];

  function MensalistaVigenciasPagamentoService($resource) {
    return $resource('api/mensalista/:mensalistaId/vigencia/:mensalistaVigenciaId/pay', {
      mensalistaId: '@mensalista._id', mensalistaVigenciaId: '@_id'
    }, {
      pay: {
        method: 'PUT'
      }
    });
  }

})();
