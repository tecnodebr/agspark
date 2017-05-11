(function () {
  'use strict';

  // Mensalista controller
  angular
  .module('mensalista')
  .controller('MensalistaCancelarController', MensalistaCancelarController);

  MensalistaCancelarController.$inject = ['$scope', '$state', 'Authentication', 'PagamentoAddScope', 'mensalistaResolve'];

  function MensalistaCancelarController ($scope, $state, Authentication, PagamentoAddScope, mensalistaResolve) {
    var vm = this;
    vm.authentication = Authentication;
    vm.mensalista = mensalistaResolve.Mensalista;
    vm.vigenciaPagamento = mensalistaResolve.VigenciaPagamento;
    vm.vigenciaAlterar = mensalistaResolve.Vigencia;
    vm.mensalistavigencias = [];
    $scope.valortotalultimavigencia = 0;
    vm.hoje = new Date();
    vm.hoje.setHours(0,0,0);
    vm.datafinalentradamaxdate = new Date(2999,12,31);
    vm.lastVigencia = {};


    PagamentoAddScope.store('formapagamentoscope', $scope);
    $scope.formapagamentotroco = 0;
    $scope.pagamentos = [];
    $scope.efetuarPagamento = function(callbackSuccess, callbackError){};
    $scope.atualizaTotal = function(valor){};
    $scope.totalPagamentoAdd = 0;
    $scope.entradaveiculo = null;
    $scope.mensalistavigencias = [];
    $scope.formapagamentototal = 0;

    mensalistaResolve.MensalistaVigencias.query({ mensalistaId : $state.params.mensalistaId }, function(vigencias){
      if(vigencias.length > 0){
        vigencias.forEach(function(p){
          if(p.status != 'pago' && new Date(p.periodovalidade.fim) >= new Date()){
            p.periodovalidade.fim = Date.parse(p.periodovalidade.fim);
            p.periodovalidade.inicio = Date.parse(p.periodovalidade.inicio);
            p.isLast = true;
            $scope.valortotalultimavigencia = parseFloat(p.valor);
            vm.datafinalentradamaxdate = new Date(p.periodovalidade.fim);
            vm.lastVigencia = p;
          }
          else {
            p.periodovalidade.fim = Date.parse(p.periodovalidade.fim);
            p.periodovalidade.inicio = Date.parse(p.periodovalidade.inicio);
            p.isLast = false;
          }
          if(p.status != 'pago')
            $scope.mensalistavigencias.push(p._id);
        });
      }
      vm.mensalistavigencias = vigencias;
      $scope.atualizaTotal($scope.totalMensalidadesPendenetes());
    });

    $scope.totalMensalidadesPendenetes = function(){
      var totalPendentes = 0;
      if(vm.mensalistavigencias.length > 0){
        vm.mensalistavigencias.forEach(function(p){
          if(p.status != 'pago')
          totalPendentes += p.valor;
        });
      }
      $scope.formapagamentototal = totalPendentes;
      return totalPendentes;
    };


    $scope.recalcularVigencia = function(vigencia){
      var qtdDiasUtilizados = Math.round((vigencia.periodovalidade.fim - vigencia.periodovalidade.inicio)/(1000*60*60*24)) + 1;
      var qtdDiasMes = Math.round((vm.datafinalentradamaxdate - vigencia.periodovalidade.inicio)/(1000*60*60*24)) + 1;
      var valorParcial = parseFloat(parseFloat((($scope.valortotalultimavigencia / qtdDiasMes) * qtdDiasUtilizados)).toFixed(2));
      vigencia.valor = valorParcial;
      $scope.atualizaTotal($scope.totalMensalidadesPendenetes());
    };

    $scope.cancelar = function(){

      $scope.efetuarPagamento(successPagamentoAddCallback, errorPagamentoAddCallback);

      function successPagamentoAddCallback(res) {
        vm.mensalista.$cancel(successCallback, errorCallback);
      }

      function errorPagamentoAddCallback(res) {
        vm.error = res.data.message;
      }

      function successCallback(res) {
        $state.go('mensalista.view', {
          mensalistaId: $state.params.mensalistaId
        });
      }

      function errorCallback(res) {
        console.log(res);
        vm.error = res.data.message;
      }
    };

    vm.save = function(isValid, form) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mensalistaForm');
        return false;
      }
      else {
        //$scope.cancelar();
        Promise.resolve(TrataValorVigenciaParcial()).then(function(retorno){ $scope.cancelar(); }).catch(function(res){ vm.error = res.data.message; });
      }

      function TrataValorVigenciaParcial() {
        return new Promise(function (resolve, reject) {
          var vigenciaAlterada = query.select(vm.mensalistavigencias).where('isLast').is(true).and('periodovalidade.fim').not().is(vm.datafinalentradamaxdate).end();
          if(vigenciaAlterada == null || vigenciaAlterada == undefined || vigenciaAlterada.length <= 0){
            resolve(vigenciaAlterada);
          }
          else {
            vigenciaAlterada = vigenciaAlterada[0];
            vm.vigenciaAlterar.get({ mensalistaId: vigenciaAlterada.mensalista._id, mensalistaVigenciaId: vigenciaAlterada._id }, function(vigenciaAlterarPeriodo){
              vigenciaAlterarPeriodo.periodovalidade.fim = vigenciaAlterada.periodovalidade.fim;
              vigenciaAlterarPeriodo.$update(resolve, reject);
            });
          }
        });
      }
    };

  }

})();
