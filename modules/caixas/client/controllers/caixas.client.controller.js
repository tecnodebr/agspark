(function () {
  'use strict';

  // Caixas controller
  angular
  .module('caixas')
  .controller('CaixasController', CaixasController);

  CaixasController.$inject = ['$scope', '$state', '$location', '$http', 'Authentication', 'caixaResolve'];

  function CaixasController ($scope, $state, $location, $http, Authentication, caixa) {
    var vm = this;
    vm.authentication = Authentication;
    vm.caixa = caixa;
    vm.caixaServiceNovo = angular.copy(caixa);

    vm.caixaServiceSaida = angular.copy(caixa);
    vm.caixaServiceSaida.error = null;

    vm.caixaServiceEntrada = angular.copy(caixa);
    vm.caixaServiceEntrada.error = null;
    vm.caixaServiceAbertura = angular.copy(caixa);
    vm.caixaServiceAbertura.error = null;
  //  vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.abrirCaixa = abrirCaixa;
    vm.fecharCaixa = fecharCaixa;
    vm.situacaoCaixa = 'Fechado';

    vm.registrarSaida = registrarSaida;
    vm.registrarEntrada = registrarEntrada;

    $scope.statusCaixa = function(callback){
      return $http.get('/api/statusCaixa').then(function(res) {
        if (res.data && res.data.caixaAberto) {
          vm.situacaoCaixa = 'Aberto';
          vm.registros = res.data.registros;
          vm.caixaAberto = res.data.caixaAberto;
          if (callback) {
            callback();
          }
        }
      });
    };

    $scope.sumValor = function(){
      if (vm.registros) {
        var valorTotal = 0;
        for (var i = 0; i < vm.registros.length; i++) {
          valorTotal += vm.registros[i].valor;
        }
        return valorTotal;
      }
      return 0;
    };

    // Remove existing Caixa
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.caixa.$remove($state.go('caixas.list'));
      }
    }

    function fecharCaixa(isValid) {
      if (confirm('Quer realmente fechar o caixa?')) {
        vm.caixa.tipoEntrada = 'FECHAMENTO';
        vm.caixa.formaDePagamento = 'DINHEIRO';
        vm.caixa.valor = 0;
        if (!vm.caixa._id) {
          vm.caixa.$save(successCallback, errorCallback);
        }else {
          successCallback();
        }
      }

      function successCallback(res) {
        vm.caixa = angular.copy(vm.caixaServiceNovo);
        if (confirm('Ok o caixa foi fechado!')) {
          $location.path('/entradaveiculos');
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function registrarSaida(isValid){
      //debugger;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.registrarSaidaForm');
        return false;
      }
      vm.caixaServiceSaida.tipoEntrada = 'SAIDA';
      vm.caixaServiceSaida.formaDePagamento = 'DINHEIRO';
      vm.caixaServiceSaida.valor = -Math.abs(vm.caixaServiceSaida.valor);
      if (!vm.caixaServiceSaida._id) {
        vm.caixaServiceSaida.$save(successCallback, errorCallback);
      }else {
        successCallback();
      }

      function successCallback(res) {
        $scope.statusCaixa(function(){
          vm.caixaServiceSaida = angular.copy(vm.caixaServiceNovo);
          vm.form.registrarSaidaForm.$setPristine();
          $scope.$broadcast('show-errors-reset', 'vm.form.registrarSaidaForm');
        });
      }

      function errorCallback(res) {
        vm.caixaServiceSaida.error = res.data.message;
      }
    }

    function registrarEntrada(isValid){
      //debugger;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.registrarEntradaForm');
        return false;
      }
      vm.caixaServiceEntrada.tipoEntrada = 'ENTRADA';
      vm.caixaServiceEntrada.formaDePagamento = 'DINHEIRO';
      vm.caixaServiceEntrada.valor = Math.abs(vm.caixaServiceEntrada.valor);
      if (!vm.caixaServiceEntrada._id) {
        vm.caixaServiceEntrada.$save(successCallback, errorCallback);
      }else {
        successCallback();
      }

      function successCallback(res) {
        $scope.statusCaixa(function(){
          vm.caixaServiceEntrada = angular.copy(vm.caixaServiceNovo);
          vm.form.registrarEntradaForm.$setPristine();
          $scope.$broadcast('show-errors-reset', 'vm.form.registrarEntradaForm');
        });
      }

      function errorCallback(res) {
        vm.caixaServiceEntrada.error = res.data.message;
      }
    }

    function abrirCaixa(isValid){
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.caixaForm');
        return false;
      }

      if (confirm('Tem certeza que deseja abrir o caixa?')) {
        vm.caixaServiceAbertura.tipoEntrada = 'ABERTURA';
        vm.caixaServiceAbertura.formaDePagamento = 'DINHEIRO';
        if (!vm.caixaServiceAbertura._id) {
          vm.caixaServiceAbertura.$save(successCallback, errorCallback);
        }else {
          successCallback();
        }
      }

      function successCallback(res) {
        vm.caixaServiceAbertura = angular.copy(vm.caixaServiceNovo);
        if (confirm('Caixa aberto com sucesso! Deseja ir para o pátio?')) {
          $location.path('/entradaveiculos');
        }
      }

      function errorCallback(res) {
        vm.caixaServiceAbertura.error = res.data.message;
      }
    }

    // Save Caixa
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.caixaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.caixa._id) {
        vm.caixa.$update(successCallback, errorCallback);
      } else {
        vm.caixa.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.caixa = angular.copy(vm.caixaServiceNovo);
        $state.go('caixas.view', {
          caixaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
