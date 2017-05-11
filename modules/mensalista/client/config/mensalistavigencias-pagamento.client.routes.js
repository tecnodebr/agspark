(function () {
  'use strict';

  angular
    .module('mensalistavigenciaspagamento')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mensalistavigenciaspagamento', {
        abstract: true,
        url: '/mensalista',
        template: '<ui-view/>'
      })
      .state('mensalistavigenciaspagamento.pay', {
        url: '/:mensalistaId/vigencia/:mensalistaVigenciaId/pay',
        templateUrl: 'modules/mensalista/client/views/vigencias/form-pagamento-mensalistavigencias.client.view.html',
        controller: 'MensalistaVigenciasPagamentoController',
        controllerAs: 'vm',
        resolve: {
          mensalistaVigenciasPagamentoResolve: getMensalistaVigenciasPagamento
        },
        data: {
          pageTitle: 'Pagamento de Mensalidade'
        },
        views: {
            '': { templateUrl: 'modules/mensalista/client/views/vigencias/form-pagamento-mensalistavigencias.client.view.html', controller: 'MensalistaVigenciasPagamentoController', controllerAs: 'vm', data: { pageTitle: 'Mensalista Edit' } },
            'formapagamentoAdd@mensalistavigenciaspagamento.pay': { templateUrl: 'modules/caixas/client/views/form-pagamento-add.client.view.html', controller: 'PagamentoAddController' }
        }
      });
  }

  getMensalistaVigenciasPagamento.$inject = ['$stateParams', 'MensalistaVigenciasPagamentoService'];

  function getMensalistaVigenciasPagamento($stateParams, MensalistaVigenciasPagamentoService) {
    return MensalistaVigenciasPagamentoService.get({
      mensalistaId: $stateParams.mensalistaId,
      mensalistaVigenciaId: $stateParams.mensalistaVigenciaId
    }).$promise;
  }
})();
