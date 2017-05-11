(function () {
  'use strict';

  // Entradaveiculos controller

  var app = angular.module('pagamentoadd');

  app.controller('PagamentoAddController', PagamentoAddController);

  PagamentoAddController.$inject = ['$scope', '$state', '$http', 'Authentication', 'PagamentoAddScope', 'PagamentoAddService'];

  function PagamentoAddController($scope, $state, $http, Authentication, PagamentoAddScope, PagamentoAddService) {
    $scope.error = null;
    $scope.formapagamentoscope = PagamentoAddScope.get('formapagamentoscope');
    $scope.formapagamentoselected = 'dinheiro';    
    $scope.formapagamentovalor = $scope.formapagamentoscope.formapagamentototal;

    $scope.addpagamentoshow = false;
    $scope.payment = PagamentoAddService;

    $scope.formapagamentoscope.atualizaTotal = function(valor){
      $scope.formapagamentoscope.formapagamentototal = valor;
      var totalAdicionado = $scope.totalFormaPagamentoAdd();
      if(totalAdicionado < $scope.formapagamentoscope.formapagamentototal)
        $scope.formapagamentovalor = $scope.formapagamentoscope.formapagamentototal - totalAdicionado;
    };

    $scope.formapagamentoscope.efetuarPagamento = function(successCallback, errorCallback){
      var sucesso = successDefaultCallback;
      if(successCallback)
        sucesso = successCallback;

      var erro = errorDefaultCallback;
      if(errorCallback)
        erro = errorCallback;

      PagamentoAddService.pay({ origem : { entradaveiculo : $scope.formapagamentoscope.entradaveiculo, mensalistavigencias : $scope.formapagamentoscope.mensalistavigencias }, pagamentos : $scope.formapagamentoscope.pagamentos, troco : $scope.formapagamentoscope.formapagamentotroco }, sucesso, erro);

      function errorDefaultCallback(data){
        alert('Ocorreu um erro inesperado ao tentar efetuar pagamento!');
        console.log(data);
      }
      function successDefaultCallback(data){
        console.log(data);
      }
    };

    $scope.totalFormaPagamentoAdd = function(total, num){
      var totalPagamentoAdd = 0;
      if($scope.formapagamentoscope.pagamentos.length > 0){
        $scope.formapagamentoscope.pagamentos.forEach(function(p){
          totalPagamentoAdd += p.Valor;
        });
      }
      $scope.formapagamentoscope.totalPagamentoAdd = totalPagamentoAdd;
      return totalPagamentoAdd;
    };

    $scope.adicionarPagamento = adicionarPagamento;
    function adicionarPagamento() {
      $scope.formapagamentoscope.pagamentos.push({ FormaPagamento : $scope.formapagamentoselected, Valor : $scope.formapagamentovalor });
      $scope.formapagamentoselected = 'dinheiro';
      $scope.formapagamentovalor = $scope.formapagamentoscope.formapagamentototal - $scope.totalFormaPagamentoAdd();

      $scope.calcula();
    }

    $scope.calcula = function calcula() {
      var troco = +($scope.totalFormaPagamentoAdd() - $scope.formapagamentoscope.formapagamentototal).toFixed(2);
      if (troco > 0) {
        $scope.formapagamentoscope.formapagamentotroco = troco;
      }else {
        $scope.formapagamentoscope.formapagamentotroco = 0;
      }
      return troco;
    };
  }

  })();
