(function () {
  'use strict';

  // Tabelaprecos controller
  angular
  .module('tabelaprecos')
  .controller('TabelaprecosController', TabelaprecosController);

  TabelaprecosController.$inject = ['$scope', '$state', 'Authentication', 'tabelaprecoResolve', 'FaixaprecosService'];

  function TabelaprecosController ($scope, $state, Authentication, tabelapreco, FaixaprecosService) {
    var vm = this;

    vm.faixaprecos = FaixaprecosService.query();

    vm.authentication = Authentication;
    vm.tabelapreco = tabelapreco;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.adicionarFaixa = adicionarFaixa;
    vm.removerFaixa = removerFaixa;



    vm.faixaprecos.$promise.then(
      function sucess(faixa){
        // remove os preços que já estão sendo usados pela tabela de preços requisitada.
        if (vm.tabelapreco.precos && vm.tabelapreco.precos.length > 0) {

          for (var i = 0; i < vm.tabelapreco.precos.length; i++) {

            var indexes = vm.faixaprecos.map(function(fpreco, index) {
              if(fpreco._id == vm.tabelapreco.precos[i]._id) {
                return index;
              }
            }).filter(isFinite);

            for (var j = 0; j < indexes.length; j++) {
              vm.faixaprecos.splice(indexes[j], 1);
            }
          }
        }else {
          vm.tabelapreco.precos =[];
        }
      },
      function error(err){
        vm.error = err;
      },
      function callback(){
        return;
      }
    );


    if (!vm.tabelapreco.diasDaSemana) {
      vm.tabelapreco.diasDaSemana = [
        { nome:'Segunda-feira', codigo:2, selecionado:false },
        { nome:'Terça-feira', codigo:3, selecionado:false },
        { nome:'Quarta-feira', codigo:4, selecionado:false },
        { nome:'Quinta-feira', codigo:5, selecionado:false },
        { nome:'Sexta-feira', codigo:6, selecionado:false },
        { nome:'Sábado', codigo:7, selecionado:false },
        { nome:'Domingo', codigo:1, selecionado:false }
      ];
    }

    // Remove existing Tabelapreco
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.tabelapreco.$remove($state.go('tabelaprecos.list'));
      }
    }


    function adicionarFaixa(faixa) {
      vm.tabelapreco.precos.push(faixa);
      var index = vm.faixaprecos.indexOf(faixa);
      if (index > -1) {
        vm.faixaprecos.splice(index, 1);
      }
    }

    function removerFaixa(faixa) {
      vm.faixaprecos.push(faixa);
      var index = vm.tabelapreco.precos.indexOf(faixa);
      if (index > -1) {
        vm.tabelapreco.precos.splice(index, 1);
      }
    }

    // Save Tabelapreco
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tabelaprecoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.tabelapreco._id) {
        vm.tabelapreco.$update(successCallback, errorCallback);
      } else {
        vm.tabelapreco.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tabelaprecos.view', {
          tabelaprecoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
