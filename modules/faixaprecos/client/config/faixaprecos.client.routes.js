(function () {
  'use strict';

  angular
    .module('faixaprecos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('faixaprecos', {
        abstract: true,
        url: '/faixaprecos',
        template: '<ui-view/>'
      })
      .state('faixaprecos.list', {
        url: '',
        templateUrl: 'modules/faixaprecos/client/views/list-faixaprecos.client.view.html',
        controller: 'FaixaprecosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Faixaprecos List'
        }
      })
      .state('faixaprecos.create', {
        url: '/create',
        templateUrl: 'modules/faixaprecos/client/views/form-faixapreco.client.view.html',
        controller: 'FaixaprecosController',
        controllerAs: 'vm',
        resolve: {
          faixaprecoResolve: newFaixapreco
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Faixaprecos Create'
        }
      })
      .state('faixaprecos.edit', {
        url: '/:faixaprecoId/edit',
        templateUrl: 'modules/faixaprecos/client/views/form-faixapreco.client.view.html',
        controller: 'FaixaprecosController',
        controllerAs: 'vm',
        resolve: {
          faixaprecoResolve: getFaixapreco
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Faixapreco {{ faixaprecoResolve.name }}'
        }
      })
      .state('faixaprecos.view', {
        url: '/:faixaprecoId',
        templateUrl: 'modules/faixaprecos/client/views/view-faixapreco.client.view.html',
        controller: 'FaixaprecosController',
        controllerAs: 'vm',
        resolve: {
          faixaprecoResolve: getFaixapreco
        },
        data:{
          pageTitle: 'Faixapreco {{ articleResolve.name }}'
        }
      });
  }

  getFaixapreco.$inject = ['$stateParams', 'FaixaprecosService'];

  function getFaixapreco($stateParams, FaixaprecosService) {
    return FaixaprecosService.get({
      faixaprecoId: $stateParams.faixaprecoId
    }).$promise;
  }

  newFaixapreco.$inject = ['FaixaprecosService'];

  function newFaixapreco(FaixaprecosService) {
    return new FaixaprecosService();
  }
})();
