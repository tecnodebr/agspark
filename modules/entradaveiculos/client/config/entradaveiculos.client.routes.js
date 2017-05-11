(function () {
  'use strict';

  angular
      .module('entradaveiculos')
      .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
          .state('entradaveiculos', {
            abstract: true,
            url: '/entradaveiculos',
            template: '<ui-view/>'
          })
          .state('entradaveiculos.list', {
            url: '',
            templateUrl: 'modules/entradaveiculos/client/views/list-entradaveiculos.client.view.html',
            controller: 'EntradaveiculosListController',
            controllerAs: 'vm',
            data: {
              pageTitle: 'Entradaveiculos List'
            }
          })
          .state('entradaveiculos.create', {
            url: '/create',
            templateUrl: 'modules/entradaveiculos/client/views/form-entradaveiculo.client.view.html',
            controller: 'EntradaveiculosController',
            controllerAs: 'vm',
            resolve: {
              entradaveiculoResolve: newEntradaveiculo
            },
            data: {
              roles: ['user', 'admin'],
              pageTitle: 'Entradaveiculos Create'
            }
          })
          .state('entradaveiculos.edit', {
            url: '/:entradaveiculoId/edit',
            templateUrl: 'modules/entradaveiculos/client/views/form-entradaveiculo.client.view.html',
            controller: 'EntradaveiculosController',
            controllerAs: 'vm',
            resolve: {
              entradaveiculoResolve: getEntradaveiculo
            },
            data: {
              roles: ['user', 'admin'],
              pageTitle: 'Edit Entradaveiculo {{ entradaveiculoResolve.name }}'
            }
          })
          .state('entradaveiculos.view', {
            url: '/:entradaveiculoId',
            templateUrl: 'modules/entradaveiculos/client/views/view-entradaveiculo.client.view.html',
            controller: 'EntradaveiculosController',
            controllerAs: 'vm',
            resolve: {
              entradaveiculoResolve: getEntradaveiculo
            },
            data: {
              pageTitle: 'Entradaveiculo {{ articleResolve.name }}'
            }
          })
          .state('entradaveiculos.saida', {
            url: '/:entradaveiculoId/saida',
            templateUrl: 'modules/entradaveiculos/client/views/form-saidaveiculo.client.view.html',
            controller: 'EntradaveiculosController',
            controllerAs: 'vm',
            resolve: {
              entradaveiculoResolve: getEntradaveiculo
            },
            data: {
              roles: ['user', 'admin'],
              pageTitle: 'Entradaveiculo {{ articleResolve.name }}'
            }
          });
  }

  getEntradaveiculo.$inject = ['$stateParams', 'EntradaveiculosService'];

  function getEntradaveiculo($stateParams, EntradaveiculosService) {
    var EntradaVeiculoApi = {};
    EntradaVeiculoApi.Entrada = EntradaveiculosService.Entrada.get({
        entradaveiculoId: $stateParams.entradaveiculoId
      });
    EntradaVeiculoApi.Permanencia = EntradaveiculosService.Permanencia;
    EntradaVeiculoApi.Saida = EntradaveiculosService.Saida;
    return EntradaVeiculoApi;
  }

  newEntradaveiculo.$inject = ['$stateParams', 'EntradaveiculosService'];

  function newEntradaveiculo($stateParams, EntradaveiculosService) {
    var EntradaVeiculoApi = {};
    EntradaVeiculoApi.Entrada = new EntradaveiculosService.Entrada();
    EntradaVeiculoApi.Permanencia = EntradaveiculosService.Permanencia;
    EntradaVeiculoApi.Saida = EntradaveiculosService.Saida;
    return EntradaVeiculoApi;
  }
})();
