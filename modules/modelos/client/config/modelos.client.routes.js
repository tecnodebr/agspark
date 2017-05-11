(function () {
  'use strict';

  angular
    .module('modelos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('modelos', {
        abstract: true,
        url: '/modelos',
        template: '<ui-view/>'
      })
      .state('modelos.list', {
        url: '',
        templateUrl: 'modules/modelos/client/views/list-modelos.client.view.html',
        controller: 'ModelosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Modelos List'
        }
      })
      .state('modelos.create', {
        url: '/create',
        templateUrl: 'modules/modelos/client/views/form-modelo.client.view.html',
        controller: 'ModelosController',
        controllerAs: 'vm',
        resolve: {
          modeloResolve: newModelo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Modelos Create'
        }
      })
      .state('modelos.edit', {
        url: '/:modeloId/edit',
        templateUrl: 'modules/modelos/client/views/form-modelo.client.view.html',
        controller: 'ModelosController',
        controllerAs: 'vm',
        resolve: {
          modeloResolve: getModelo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Modelo {{ modeloResolve.name }}'
        }
      })
      .state('modelos.view', {
        url: '/:modeloId',
        templateUrl: 'modules/modelos/client/views/view-modelo.client.view.html',
        controller: 'ModelosController',
        controllerAs: 'vm',
        resolve: {
          modeloResolve: getModelo
        },
        data:{
          pageTitle: 'Modelo {{ articleResolve.name }}'
        }
      });
  }

  getModelo.$inject = ['$stateParams', 'ModelosService'];

  function getModelo($stateParams, ModelosService) {
    var api = {};
    api.modelo = ModelosService.modelo.get({
      modeloId: $stateParams.modeloId
    });

    api.marca = ModelosService.marca;
  }

  newModelo.$inject = ['ModelosService'];

  function newModelo(ModelosService) {
    var modeloApiService = {};
    modeloApiService.modelo = new ModelosService.modelo();
    modeloApiService.marca = ModelosService.marca;
    return modeloApiService;
  }
})();
