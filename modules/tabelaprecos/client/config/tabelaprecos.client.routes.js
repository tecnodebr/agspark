(function () {
  'use strict';

  angular
    .module('tabelaprecos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tabelaprecos', {
        abstract: true,
        url: '/tabelaprecos',
        template: '<ui-view/>'
      })
      .state('tabelaprecos.list', {
        url: '',
        templateUrl: 'modules/tabelaprecos/client/views/list-tabelaprecos.client.view.html',
        controller: 'TabelaprecosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tabelaprecos List'
        }
      })
      .state('tabelaprecos.create', {
        url: '/create',
        templateUrl: 'modules/tabelaprecos/client/views/form-tabelapreco.client.view.html',
        controller: 'TabelaprecosController',
        controllerAs: 'vm',
        resolve: {
          tabelaprecoResolve: newTabelapreco
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Tabelaprecos Create'
        }
      })
      .state('tabelaprecos.edit', {
        url: '/:tabelaprecoId/edit',
        templateUrl: 'modules/tabelaprecos/client/views/form-tabelapreco.client.view.html',
        controller: 'TabelaprecosController',
        controllerAs: 'vm',
        resolve: {
          tabelaprecoResolve: getTabelapreco
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Tabelapreco {{ tabelaprecoResolve.name }}'
        }
      })
      .state('tabelaprecos.view', {
        url: '/:tabelaprecoId',
        templateUrl: 'modules/tabelaprecos/client/views/view-tabelapreco.client.view.html',
        controller: 'TabelaprecosController',
        controllerAs: 'vm',
        resolve: {
          tabelaprecoResolve: getTabelapreco
        },
        data:{
          pageTitle: 'Tabelapreco {{ articleResolve.name }}'
        }
      });
  }

  getTabelapreco.$inject = ['$stateParams', 'TabelaprecosService'];

  function getTabelapreco($stateParams, TabelaprecosService) {
    return TabelaprecosService.get({
      tabelaprecoId: $stateParams.tabelaprecoId
    }).$promise;
  }

  newTabelapreco.$inject = ['TabelaprecosService'];

  function newTabelapreco(TabelaprecosService) {
    return new TabelaprecosService();
  }
})();
