(function () {
  'use strict';

  // Entradaveiculos controller

  var app = angular.module('entradaveiculos');

  app.controller('EntradaveiculosController', EntradaveiculosController);

  EntradaveiculosController.$inject = ['$scope', '$state', '$http', 'Authentication', 'entradaveiculoResolve'];

  function EntradaveiculosController($scope, $state, $http, Authentication, entradaveiculo) {
    var vm = this;
    vm.entradaveiculo = entradaveiculo.Entrada;
    vm.permanencia = entradaveiculo.Permanencia;
    vm.saida = entradaveiculo.Saida;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.tabelaSelecionada = {};
    vm.formapagamentoselected = 'dinheiro';
    vm.formapagamentovalor = 0;
    vm.horarios = [];
    vm.pagamentos = [];
    vm.addpagamentoshow = false;

    $scope.searchVeiculo ={};
    $scope.searchVeiculo.categoriaVeiculo = 'CARRO';

    $scope.veiculoSelecionado;
    $scope.veiculoSearchCanged = function (){
      debugger;
      $scope.veiculos = query.select($scope.todosVeiculos).where('marca.categoriaVeiculo').is($scope.searchVeiculo.categoriaVeiculo).end();
    };

    carregaModelos();
    $scope.cores = ['','Amarelo','Azul','Bege','Branco','Bronze','Cinza','Dourado','Indefinida','Laranja','Marrom','Prata','Preto','Rosa','Roxo','Verde','Vermelho','Vinho'];

    $scope.totalFormaPagamentoAdd = function(total, num){
      var totalPagamentoAdd = 0;
      if(vm.pagamentos.length > 0){
        vm.pagamentos.forEach(function(p){
          totalPagamentoAdd += p.Valor;
        });
      }
      return totalPagamentoAdd;
    };


    $scope.buscaMensalistaByPlaca = function (){
      FindMensalista();
    };

    function FindMensalista(callback){
      var placa = '';
      if(vm.entradaveiculo.placaLetras && vm.entradaveiculo.placaNumeros)
      {
        placa = vm.entradaveiculo.placaLetras.concat(vm.entradaveiculo.placaNumeros).toUpperCase();
        $http.get('/api/mensalista/findByPlaca/'.concat(placa))
        .then(function(res){
          vm.mensalista = res.data;
          vm.entradaveiculo.veiculo = vm.mensalista.carros[0].marcaModelo;
          vm.entradaveiculo.corVeiculo = vm.mensalista.carros[0].corVeiculo;
          if(callback)
          callback();
        }, function(err){
          console.log(err);
        });
      }
    }

    $scope.onSelect = function ($item, $model, $label) {
      //$scope.$item = $item;
      vm.entradaveiculo.veiculo = $model;
      //$scope.$label = $label;
    };

    function carregaModelos(callback){
      $http.get('/api/modelos')
      .then(function(res){
        $scope.todosVeiculos = res.data;
        for (var i = 0; i < $scope.todosVeiculos.length; i++) {
          $scope.todosVeiculos[i].marcaModelo = $scope.todosVeiculos[i].nome + ' - ' + $scope.todosVeiculos[i].marca.nome;
        }
        //veiculos =$scope.todosVeiculos;
        $scope.veiculos = query.select($scope.todosVeiculos).where('marca.categoriaVeiculo').is($scope.searchVeiculo.categoriaVeiculo).end();
        if(callback)
        callback();
      }, function(err){
        console.log(err);
      });
    }

    function ObterHorariosPermanencia(sucessoCallback, errorCallback){
      vm.permanencia.get({ entradaveiculoId : $state.params.entradaveiculoId }, sucessoCallback, errorCallback);
    }

    $scope.HorariosPermanencia = function (){
      ObterHorariosPermanencia(sucessoCallback, errorCallback);

      function errorCallback(res) {
        vm.error = res.data.message;
      }

      function sucessoCallback(res) {
        vm.horarios = res.horarios;
        vm.horarios.forEach(function(horario){
          horario.HoraInicio = new Date(1970, 0, 1, 0, horario.Inicio, 0);
          horario.HoraFim = new Date(1970, 0, 1, 0, horario.Fim, 0);
          horario.Tempo = new Date(1970, 0, 1, 0, horario.Minutos, 0);
        });
      }
    };

    // Remove existing Entradaveiculo
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.entradaveiculo.$remove($state.go('entradaveiculos.create'));
      }
    }

    $scope.adicionarPagamento = function adicionarPagamento() {
      vm.pagamentos.push({ FormaPagamento : vm.formapagamentoselected, Valor : vm.formapagamentovalor });
      vm.formapagamentoselected = 'dinheiro';
      vm.formapagamentovalor = 0;
      if($scope.totalFormaPagamentoAdd() >= vm.entradaveiculo.valorEstadia) {
        setTimeout(function(){ document.querySelector('#btnAddPagamento').click(); }, 1);
        vm.addpagamentoshow = false;
      }
      $scope.calcula();
    };

    $scope.calcula = function calcula() {
      var troco = +($scope.totalFormaPagamentoAdd() - vm.entradaveiculo.valorEstadia).toFixed(2);
      if (troco > 0) {
        vm.entradaveiculo.valorTroco = troco;
      }else {
        vm.entradaveiculo.valorTroco = 0;
      }
    };

    function ObterValoresSaida(tabela, sucessoCallback, errorCallback){
      if(tabela)
      vm.saida.get({ entradaveiculoId : $state.params.entradaveiculoId, tabelaprecoId : tabela._id }, sucessoCallback, errorCallback);
    }

    $scope.tabelaSelecionada_change = function tabelaSelecionada_change(tabela){
      ObterValoresSaida(tabela, sucessoCallback, errorCallback);

      function errorCallback(res) {
        vm.error = res.data.message;
      }

      function sucessoCallback(res) {
        vm.horarios = res.horarios;
        var total = 0;
        vm.horarios.forEach(function(horario){
          horario.HoraInicio = new Date(1970, 0, 1, 0, horario.Inicio, 0);
          horario.HoraFim = new Date(1970, 0, 1, 0, horario.Fim, 0);
          horario.Tempo = new Date(1970, 0, 1, 0, horario.Minutos, 0);
          total += horario.Valor;
        });

        vm.entradaveiculo.valorEstadia = total;
        vm.addpagamentoshow = true;
      }
    };

    // Save Entradaveiculo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.entradaveiculoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.entradaveiculo._id) {
        vm.entradaveiculo.dynamicProperties.pagamentos = vm.pagamentos;
        vm.entradaveiculo.pagamentos = vm.pagamentos;
        vm.entradaveiculo.$update(successCallback, errorCallback);
      } else {
        vm.entradaveiculo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('entradaveiculos.list', {
          entradaveiculoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }




  app.directive('limitTo', [function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var limit = parseInt(attrs.limitTo);
        angular.element(elem).on('keypress', function(e) {
          if (this.value.length == limit) e.preventDefault();
        });
      }
    };
  }]);

})();
