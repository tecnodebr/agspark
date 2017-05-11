(function () {
  'use strict';

  angular
    .module('empresa')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('empresa', {
        abstract: true,
        url: '/empresa',
        template: '<ui-view/>'
      })
      .state('empresa.create', {
        url: '/create',
        templateUrl: 'modules/configuracoes/client/views/empresa/form-empresa.client.view.html',
        controller: 'EmpresaController',
        controllerAs: 'vm',
        resolve: {
          empresaResolve: newEmpresa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Dados Empresarial'
        }
      })
      .state('empresa.edit', {
        url: '/:empresaId/edit',
        templateUrl: 'modules/configuracoes/client/views/empresa/form-empresa.client.view.html',
        controller: 'EmpresaController',
        controllerAs: 'vm',
        resolve: {
          empresaResolve: getEmpresa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Dados Empresarial {{ empresaResolve.name }}'
        }
      })
      .state('empresa.view', {
        url: '/:empresaId',
        templateUrl: 'modules/configuracoes/client/views/empresa/view-empresa.client.view.html',
        controller: 'EmpresaController',
        controllerAs: 'vm',
        resolve: {
          empresaResolve: getEmpresa
        },
        data:{
          pageTitle: 'Empresa {{ articleResolve.name }}'
        }
      });
  }

  getEmpresa.$inject = ['$stateParams', 'EmpresaService'];

  function getEmpresa($stateParams, EmpresaService) {
    return EmpresaService.get({
      empresaId: $stateParams.empresaId
    }).$promise;
  }

  newEmpresa.$inject = ['$http', '$location', 'EmpresaService'];

  function newEmpresa($http, $location, EmpresaService) {
    var config = {
     headers : { 'Accept' : 'application/json' }
    };

    return Promise.resolve(ValidaEmpresa(config)).then(function(result){
      return result;
    });

    function ValidaEmpresa(conf){
      return $http.get('/api/empresa', config).then(function(response) {
        if(response != null && response != undefined && response.data != undefined && response.data.length != undefined && response.data.length > 0)
        {
          return Promise.resolve($location.url('/empresa/' + response.data[0]._id + '/edit')).then(function(result){
            return EmpresaService.get({
              empresaId: response.data[0]._id
            }).$promise;
          });
        }
        else {
          return new EmpresaService();
        }
     });
    }
  }

})();
