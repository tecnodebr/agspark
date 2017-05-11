//Faixaprecos service used to communicate Faixaprecos REST endpoints
(function () {
  'use strict';

  angular
    .module('faixaprecos')
    .factory('FaixaprecosService', FaixaprecosService);

  FaixaprecosService.$inject = ['$resource'];

  function FaixaprecosService($resource) {
    return $resource('api/faixaprecos/:faixaprecoId', {
      faixaprecoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
