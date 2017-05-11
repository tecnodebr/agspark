//Tabelaprecos service used to communicate Tabelaprecos REST endpoints
(function () {
  'use strict';

  angular
    .module('tabelaprecos')
    .factory('TabelaprecosService', TabelaprecosService);

  TabelaprecosService.$inject = ['$resource'];

  function TabelaprecosService($resource) {
    return $resource('api/tabelaprecos/:tabelaprecoId', {
      tabelaprecoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
