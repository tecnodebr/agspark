//Mensalista service used to communicate Mensalista REST endpoints
(function () {
  'use strict';

  angular
    .module('mensalista')
    .factory('MensalistaCancelarService', MensalistaCancelarService);

  MensalistaCancelarService.$inject = ['$resource'];

  function MensalistaCancelarService($resource) {
    var MensalistaCancelarApi = {};

    MensalistaCancelarApi.Mensalista = $resource('api/mensalista/:mensalistaId/cancel', {
      mensalistaId: '@_id'
    }, {
      cancel: {
        method: 'PUT'
      }
    });

    MensalistaCancelarApi.MensalistaVigencias = $resource('api/mensalista/:mensalistaId/vigencia', {
      mensalistaId: '@mensalistaId'
    });
    MensalistaCancelarApi.Vigencia = $resource('api/mensalista/:mensalistaId/vigencia/:mensalistaVigenciaId', {
      mensalistaId: '@mensalista._id', mensalistaVigenciaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
    MensalistaCancelarApi.VigenciaPagamento = $resource('api/mensalista/:mensalistaId/vigencia/:mensalistaVigenciaId/pay', {
      mensalistaId: '@mensalista._id', mensalistaVigenciaId: '@_id'
    }, {
      pay: {
        method: 'PUT'
      }
    });
    return MensalistaCancelarApi;
  }

})();
