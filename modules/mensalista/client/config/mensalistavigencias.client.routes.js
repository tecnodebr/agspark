(function () {
  'use strict';

  angular
    .module('mensalistavigencias')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mensalistavigencias', {
        abstract: true,
        url: '/mensalista',
        template: '<ui-view/>'
      })
      .state('mensalistavigencias.list', {
        url: '/:mensalistaId/vigencia',
        templateUrl: 'modules/mensalista/client/views/vigencias/list-mensalistavigencias.client.view.html',
        controller: 'MensalistaVigenciasController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mensalista List'
        }
      })
      .state('mensalistavigencias.create', {
        url: '/create',
        templateUrl: 'modules/mensalista/vigencias/client/views/form-mensalista.client.view.html',
        controller: 'MensalistaController',
        controllerAs: 'vm',
        resolve: {
          mensalistaResolve: newMensalistaVigencias
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Mensalista Create'
        }
      })
      .state('mensalistavigencias.edit', {
        url: '/:mensalistaId/vigencia/:mensalistaVigenciaId/edit',
        templateUrl: 'modules/mensalista/client/views/vigencias/form-mensalistavigencias.client.view.html',
        controller: 'MensalistaVigenciasController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mensalista Edit'
        }
      })
      .state('mensalistavigencias.view', {
        url: '/:mensalistaVigenciasId',
        templateUrl: 'modules/mensalista/vigencias/client/views/view-mensalista.client.view.html',
        controller: 'MensalistaController',
        controllerAs: 'vm',
        resolve: {
          mensalistaResolve: getMensalistaVigencias
        },
        data:{
          pageTitle: 'Vigencias {{ articleResolve.mensalista.nome }}'
        }
      });
  }

  getMensalistaVigencias.$inject = ['$stateParams', 'MensalistaVigenciasService'];

  function getMensalistaVigencias($stateParams, MensalistaVigenciasService) {
    return MensalistaVigenciasService.get({
      mensalistaId: $stateParams.mensalistaVigenciasId
    }).$promise;
  }

  newMensalistaVigencias.$inject = ['MensalistaVigenciasService'];

  function newMensalistaVigencias(MensalistaVigenciasService) {
    return new MensalistaVigenciasService();
  }
})();
