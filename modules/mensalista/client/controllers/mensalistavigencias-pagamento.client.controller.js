(function () {
  'use strict';

  angular
    .module('mensalistavigenciaspagamento')
    .controller('MensalistaVigenciasPagamentoController', MensalistaVigenciasPagamentoController);

  MensalistaVigenciasPagamentoController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'PagamentoAddScope', 'mensalistaVigenciasPagamentoResolve'];

  function MensalistaVigenciasPagamentoController($scope, $rootScope, $state, Authentication, PagamentoAddScope, mensalistaVigenciasPagamentoResolve) {
    var vm = this;
    vm.error = null;
    vm.vigenciaPagamento = mensalistaVigenciasPagamentoResolve;
    PagamentoAddScope.store('formapagamentoscope', $scope);
    $scope.formapagamentototal = vm.vigenciaPagamento.valor;
    $scope.formapagamentotroco = 0;
    $scope.pagamentos = [];
    $scope.efetuarPagamento = function(callbackSuccess, callbackError){};
    $scope.totalPagamentoAdd = 0;
    $scope.entradaveiculo = null;
    $scope.mensalistavigencias = [];
    $scope.mensalistavigencias.push($state.params.mensalistaVigenciaId);


    $scope.valorVigenciaChange = function(){
      $scope.formapagamentototal = vm.vigenciaPagamento.valor;
    };

    $scope.pay = function(){

      $scope.efetuarPagamento(successPagamentoAddCallback, errorPagamentoAddCallback);

      function successPagamentoAddCallback(res) {
        vm.vigenciaPagamento.status = 'pago';
        console.log(res.data);
        vm.vigenciaPagamento.$pay(successCallback, errorCallback);
      }

      function errorPagamentoAddCallback(res) {
        console.log(res.data.message);
        vm.error = res.data.message;
      }

      function successCallback(res) {
        $state.go('mensalistavigencias.list', {
          mensalistaId: $state.params.mensalistaId
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

  }
})();
