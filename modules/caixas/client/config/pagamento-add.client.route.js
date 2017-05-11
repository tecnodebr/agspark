(function () {
  'use strict';

  angular
    .module('pagamentoadd')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pagamentoadd', {
        abstract: true,
        url: '/pagamentoadd',
        template: '<ui-view="formapagamentoAdd"/>'
      })
      .state('pagamentoadd.view', {
        url: '',
        templateUrl: 'modules/caixas/client/views/form-pagamento-add.client.view.html',
        controller: 'CaixasListController',
        data: {
          pageTitle: 'Adicionar Pagamento'
        }
      });
  }
})();
