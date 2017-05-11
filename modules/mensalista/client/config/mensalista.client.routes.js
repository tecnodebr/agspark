(function () {
  'use strict';

  angular
    .module('mensalista')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mensalista', {
        abstract: true,
        url: '/mensalista',
        template: '<ui-view/>'
      })
      .state('mensalista.list', {
        url: '',
        templateUrl: 'modules/mensalista/client/views/list-mensalista.client.view.html',
        controller: 'MensalistaListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mensalista List'
        }
      })
      .state('mensalista.create', {
        url: '/create',
        templateUrl: 'modules/mensalista/client/views/form-mensalista.client.view.html',
        controller: 'MensalistaController',
        controllerAs: 'vm',
        resolve: {
          mensalistaResolve: newMensalista
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Mensalista Create'
        }
      })
      .state('mensalista.edit', {
        url: '/:mensalistaId/edit',
        templateUrl: 'modules/mensalista/client/views/form-mensalista.client.view.html',
        controller: 'MensalistaController',
        controllerAs: 'vm',
        resolve: {
          mensalistaResolve: getMensalista
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Mensalista {{ mensalistaResolve.name }}'
        }
      })
      .state('mensalista.cancel', {
        url: '/:mensalistaId/cancel',
        templateUrl: 'modules/mensalista/client/views/form-mensalistacancelar.client.view.html',
        controller: 'MensalistaCancelarController',
        controllerAs: 'vm',
        resolve: {
          mensalistaResolve: getMensalistaCancelar
        },
        data: {
          pageTitle: 'Cancelamento Mensalista {{ mensalistaResolve.name }}'
        },
        views: {
            '': { templateUrl: 'modules/mensalista/client/views/form-mensalistacancelar.client.view.html', controller: 'MensalistaCancelarController', controllerAs: 'vm', data: { pageTitle: 'Cancelamento Mensalista {{ mensalistaResolve.name }}' } },
            'formapagamentoAdd@mensalista.cancel': { templateUrl: 'modules/caixas/client/views/form-pagamento-add.client.view.html', controller: 'PagamentoAddController' }
        }
      })
      .state('mensalista.view', {
        url: '/:mensalistaId',
        templateUrl: 'modules/mensalista/client/views/view-mensalista.client.view.html',
        controller: 'MensalistaController',
        controllerAs: 'vm',
        resolve: {
          mensalistaResolve: getMensalista
        },
        data:{
          pageTitle: 'Mensalista {{ articleResolve.name }}'
        }
      });
  }

  getMensalista.$inject = ['$stateParams', 'MensalistaService'];

  function getMensalista($stateParams, MensalistaService) {
    return MensalistaService.get({
      mensalistaId: $stateParams.mensalistaId
    }).$promise;
  }

  newMensalista.$inject = ['MensalistaService'];

  function newMensalista(MensalistaService) {
    return new MensalistaService();
  }

  getMensalistaCancelar.$inject = ['$stateParams', 'MensalistaCancelarService'];

  function getMensalistaCancelar($stateParams, MensalistaCancelarService) {
    var MensalistaCancelarApi = {};

    MensalistaCancelarApi.Mensalista = MensalistaCancelarService.Mensalista.get({
      mensalistaId: $stateParams.mensalistaId
    });

    MensalistaCancelarApi.MensalistaVigencias = MensalistaCancelarService.MensalistaVigencias;

    MensalistaCancelarApi.Vigencia = MensalistaCancelarService.Vigencia;
    MensalistaCancelarApi.VigenciaPagamento = MensalistaCancelarService.VigenciaPagamento;

    return MensalistaCancelarApi;
  }
})();
