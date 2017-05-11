//Mensalista service used to communicate Mensalista REST endpoints
(function () {
  'use strict';

  angular
    .module('mensalistavigencias')
    .factory('MensalistaVigenciasService', MensalistaVigenciasService);

  MensalistaVigenciasService.$inject = ['$resource'];

  function MensalistaVigenciasService($resource) {
    var MensalistaVigenciasApi = {};
    MensalistaVigenciasApi.MensalistaVigencias = $resource('api/mensalista/:mensalistaId/vigencia', {
      mensalistaId: '@mensalistaId'
    });
    MensalistaVigenciasApi.Vigencia = $resource('api/mensalista/:mensalistaId/vigencia/:mensalistaVigenciaId', {
      mensalistaId: '@mensalista._id', mensalistaVigenciaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
    MensalistaVigenciasApi.VigenciaPagamento = $resource('api/mensalista/:mensalistaId/vigencia/:mensalistaVigenciaId/pay', {
      mensalistaId: '@mensalista._id', mensalistaVigenciaId: '@_id'
    }, {
      pay: {
        method: 'PUT'
      }
    });
    return MensalistaVigenciasApi;
  }

})();
