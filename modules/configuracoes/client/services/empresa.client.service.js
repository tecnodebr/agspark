//Configuracoes service used to communicate Configuracoes REST endpoints
(function () {
  'use strict';

  angular
    .module('empresa')
    .factory('EmpresaService',EmpresaService);

  EmpresaService.$inject = ['$resource'];

  function EmpresaService($resource) {
    return $resource('api/empresa/:empresaId', {
      empresaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
