(function () {
  'use strict';

  angular
    .module('mensalistavalor')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mensalistavalor', {
        abstract: true,
        url: '/mensalistavalor',
        template: '<ui-view/>'
      })
      .state('mensalistavalor.list', {
        url: '',
        templateUrl: 'modules/mensalista/client/views/valor/list-mensalistavalor.client.view.html',
        controller: 'MensalistaValorController',
        controllerAs: 'vm',
        resolve: {
          mensalistaResolve: newMensalistaValor
        },
        data: {
          pageTitle: 'Lista Mensalista Valor'
        }
      })
      .state('mensalistavalor.create', {
        url: '/create',
        templateUrl: 'modules/mensalista/client/views/valor/form-mensalistavalor.client.view.html',
        controller: 'MensalistaValorController',
        controllerAs: 'vm',
        resolve: {
          mensalistaResolve: newMensalistaValor
        }
      });
    }

    newMensalistaValor.$inject = ['MensalistaValorService'];

    function newMensalistaValor(MensalistaValorService) {
      return new MensalistaValorService();
    }
})();
