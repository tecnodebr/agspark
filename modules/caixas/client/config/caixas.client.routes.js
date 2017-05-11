(function () {
  'use strict';

  angular
    .module('caixas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('caixas', {
        abstract: true,
        url: '/caixas',
        template: '<ui-view/>'
      })
      .state('caixas.list', {
        url: '',
        templateUrl: 'modules/caixas/client/views/list-caixas.client.view.html',
        controller: 'CaixasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Caixas List'
        }
      })
      .state('caixas.create', {
        url: '/create',
        templateUrl: 'modules/caixas/client/views/form-caixa.client.view.html',
        controller: 'CaixasController',
        controllerAs: 'vm',
        resolve: {
          caixaResolve: newCaixa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Caixas Create'
        }
      })
      .state('caixas.edit', {
        url: '/:caixaId/edit',
        templateUrl: 'modules/caixas/client/views/form-caixa.client.view.html',
        controller: 'CaixasController',
        controllerAs: 'vm',
        resolve: {
          caixaResolve: getCaixa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Caixa {{ caixaResolve.name }}'
        }
      })
      .state('caixas.view', {
        url: '/:caixaId',
        templateUrl: 'modules/caixas/client/views/view-caixa.client.view.html',
        controller: 'CaixasController',
        controllerAs: 'vm',
        resolve: {
          caixaResolve: getCaixa
        },
        data:{
          pageTitle: 'Caixa {{ caixaResolve.name }}'
        }
      });
  }

  getCaixa.$inject = ['$stateParams', 'CaixasService'];

  function getCaixa($stateParams, CaixasService) {
    return CaixasService.get({
      caixaId: $stateParams.caixaId
    }).$promise;
  }

  newCaixa.$inject = ['CaixasService'];

  function newCaixa(CaixasService) {
    return new CaixasService();
  }
})();
