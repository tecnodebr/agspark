//Caixas service used to communicate Caixas REST endpoints
(function () {
  'use strict';

  angular
    .module('caixas')
    .factory('CaixasService', CaixasService);

  CaixasService.$inject = ['$resource'];

  function CaixasService($resource) {
    return $resource('api/caixas/:caixaId', {
      caixaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
