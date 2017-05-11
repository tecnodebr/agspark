(function () {
  'use strict';

  angular
    .module('configuracoes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('configuracoes', {
        abstract: true,
        url: '/configuracoes',
        template: '<ui-view/>'
      })
      .state('configuracoes.list', {
        url: '',
        templateUrl: 'modules/configuracoes/client/views/list-configuracoes.client.view.html',
        controller: 'ConfiguracoesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Configuracoes List'
        }
      })
      .state('configuracoes.create', {
        url: '/create',
        templateUrl: 'modules/configuracoes/client/views/form-configuracoes.client.view.html',
        controller: 'ConfiguracoesController',
        controllerAs: 'vm',
        resolve: {
          configuracoesResolve: newConfiguracoes
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Configuracoes Create'
        }
      })
      .state('configuracoes.edit', {
        url: '/:configuracoesId/edit',
        templateUrl: 'modules/configuracoes/client/views/form-configuracoes.client.view.html',
        controller: 'ConfiguracoesController',
        controllerAs: 'vm',
        resolve: {
          configuracoesResolve: getConfiguracoes
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Configuracoes {{ configuracoesResolve.name }}'
        }
      })
      .state('configuracoes.view', {
        url: '/:configuracoesId',
        templateUrl: 'modules/configuracoes/client/views/view-configuracoes.client.view.html',
        controller: 'ConfiguracoesController',
        controllerAs: 'vm',
        resolve: {
          configuracoesResolve: getConfiguracoes
        },
        data:{
          pageTitle: 'Configuracoes {{ articleResolve.name }}'
        }
      });
  }

  getConfiguracoes.$inject = ['$stateParams', 'ConfiguracoesService'];

  function getConfiguracoes($stateParams, ConfiguracoesService) {
    return ConfiguracoesService.get({
      configuracoesId: $stateParams.configuracoesId
    }).$promise;
  }

  newConfiguracoes.$inject = ['ConfiguracoesService'];

  function newConfiguracoes(ConfiguracoesService) {
    return new ConfiguracoesService();
  }
})();
