//Mensalista service used to communicate MensalistaValor REST endpoints
(function () {
  'use strict';

  angular
    .module('mensalistavalor')
    .factory('MensalistaValorService', MensalistaValorService);

  MensalistaValorService.$inject = ['$resource'];

  function MensalistaValorService($resource) {
    return $resource('api/mensalistavalor');
  }
})();
