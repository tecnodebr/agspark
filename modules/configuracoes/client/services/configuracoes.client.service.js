//Configuracoes service used to communicate Configuracoes REST endpoints
(function () {
  'use strict';

  angular
    .module('configuracoes')
    .factory('ConfiguracoesService', ConfiguracoesService);

  ConfiguracoesService.$inject = ['$resource'];

  function ConfiguracoesService($resource) {
    return $resource('api/configuracoes/:configuracoesId', {
      configuracoesId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
