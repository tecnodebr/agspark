//Caixas service used to communicate Caixas REST endpoints
(function () {
  'use strict';

  // Authentication service for user variables
  angular.module('pagamentoadd')
  .factory('PagamentoAddScope',
   ['$window', function ($window, $rootScope) {
      var mem = {};

      return {
          store: function (key, value) {
              mem[key] = value;
          },
          get: function (key) {
              return mem[key];
          }
      };
    }
  ])
  .factory('PagamentoAddService', PagamentoAddService);

  PagamentoAddService.$inject = ['$resource'];

  function PagamentoAddService($resource) {
    return $resource('api/pay', {},{
      pay: {
        method: 'PUT'
      }
    });
  }

})();
