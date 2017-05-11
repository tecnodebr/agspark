(function () {
  'use strict';

  // Mensalista controller
  angular
  .module('mensalista')
  .controller('MensalistaController', MensalistaController);

  MensalistaController.$inject = ['$scope', '$state', '$http', 'Authentication', 'mensalistaResolve'];

  function MensalistaController ($scope, $state, $http, Authentication, mensalista) {
    var vm = this;

    vm.authentication = Authentication;
    vm.mensalista = mensalista;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if (!vm.mensalista.telefones) {
      vm.mensalista.telefones = [];
    }

    $scope.telefonesToAdd = [];
    $scope.modoEdicaoCarros = false;
    $scope.escodeBotoesCarro = false;
    $scope.modeloSelecionado = null;
    $scope.veiculoSelecionado = null;

    $scope.onSelect = function ($item, $model, $label) {
      //$scope.$item = $item;
      $scope.modeloSelecionado = $model;
      //$scope.$label = $label;
    };

    function carregaModelos(callback){
      $http.get('/api/modelos')
      .then(function(res){
        $scope.veiculos = res.data;
        for (var i = 0; i < $scope.veiculos.length; i++) {
          $scope.veiculos[i].marcaModelo = $scope.veiculos[i].nome + ' - ' + $scope.veiculos[i].marca.nome;
        }

        if(callback)
        callback();
      }, function(err){
        console.log(err);
      });
    }

    carregaModelos();

    $scope.cores = ['Amarelo','Azul','Bege','Branco','Bronze','Cinza','Dourado','Indefinida','Laranja','Marrom','Prata','Preto','Rosa','Roxo','Verde','Vermelho','Vinho'];

    $scope.addTelefone = function(itemToAdd) {
      var index = $scope.telefonesToAdd.indexOf(itemToAdd);
      $scope.telefonesToAdd.splice(index, 1);
      vm.mensalista.telefones.push(angular.copy(itemToAdd));
    };

    $scope.removeTelefone = function(item) {
      var index = vm.mensalista.telefones.indexOf(item);
      vm.mensalista.telefones.splice(index, 1);
    };

    $scope.addNewTelefone = function() {
      if($scope.telefonesToAdd == null || $scope.telefonesToAdd == undefined || $scope.telefonesToAdd.length <= 0)
      $scope.telefonesToAdd.push('');
    };

    $scope.CancelNewTelefone = function(item) {
      var index = $scope.telefonesToAdd.indexOf(item);
      $scope.telefonesToAdd.splice(index, 1);
    };

    if (!vm.mensalista.carros) {
      vm.mensalista.carros = [];
    }else {
      for (var i = 0; i < vm.mensalista.carros.length; i++) {
        for (var j = 0; j < vm.mensalista.carros[i].diasDaSemana.length; j++) {
          vm.mensalista.carros[i].diasDaSemana[j].horarioFinal = new Date(vm.mensalista.carros[i].diasDaSemana[j].horarioFinal);
          vm.mensalista.carros[i].diasDaSemana[j].horarioInicial = new Date(vm.mensalista.carros[i].diasDaSemana[j].horarioInicial);
        }
      }
    }

    // sample data we would get back from an api
      var users = [
          {
            name: 'Chris',
            email: ''
          },
          {
            name: 'Holly',
            email: ''
          }
      ];

      // assign this data to an object to store all our form data
      $scope.formData = {};
      $scope.formData.users = users;

    $scope.carrosToAdd = [];
    $scope.carroEdicao ={};
    $scope.formAdicionarCarro = {};

    $scope.addCarro = function(itemToAdd, form) {
      if (form.$valid) {
        itemToAdd.marcaModelo = $scope.modeloSelecionado;
        itemToAdd.placaLetras = itemToAdd.placaLetras.toUpperCase();
        var index = $scope.carrosToAdd.indexOf(itemToAdd);
        $scope.carrosToAdd.splice(index, 1);
        if (!$scope.modoEdicaoCarros) {
          vm.mensalista.carros.push(angular.copy(itemToAdd));
        }
        $scope.escodeBotoesCarro = false;
        $scope.modoEdicaoCarros = false;
      }else {
        form.error = 'Erros encontrados, por favor verifique se não faltou nenhum dado.';
      }
    };

    $scope.removeCarro = function(item) {
      var index = vm.mensalista.carros.indexOf(item);
      if (index >= 0) {
        vm.mensalista.carros.splice(index, 1);
      }
    };

    $scope.cancelAddCarro = function(carroEdicao){
      // Remove carro do array da base
      $scope.removeCarro(carroEdicao);
      // Remove carro do array de edição
      var index = $scope.carrosToAdd.indexOf(carroEdicao);
      $scope.carrosToAdd.splice(index, 1);
      if ($scope.modoEdicaoCarros) {
        // Devolve o carro inalterado.
        vm.mensalista.carros.push($scope.carroEdicao);
      }

      $scope.escodeBotoesCarro = false;
      $scope.modoEdicaoCarros = false;
    };

    $scope.addNewCarro = function(carro) {
      if (carro) {
        $scope.carroEdicao = angular.copy(carro);
        $scope.carroEdicao.placaLetras = $scope.carroEdicao.placaLetras.toUpperCase();
        $scope.escodeBotoesCarro = true;
        $scope.carrosToAdd.push(carro);
        $scope.modoEdicaoCarros = true;
        //$scope.removeCarro(carro);
      }else {
        $scope.escodeBotoesCarro = true;
        $scope.modoEdicaoCarros = false;
        $scope.carrosToAdd.push(
          {
            placa:'',
            diasDaSemana:[
              {
                nome:'Segunda-feira',
                codigo:2,
                selecionado:true,
                horarioInicial: new Date(1970, 0, 1, 0, 0, 0),
                horarioFinal: new Date(1970, 0, 1, 23, 59, 59)
              },{
                nome:'Terça-feira',
                codigo:3,
                selecionado:true,
                horarioInicial: new Date(1970, 0, 1, 0, 0, 0),
                horarioFinal: new Date(1970, 0, 1, 23, 59, 59)
              },
              {
                nome:'Quarta-feira',
                codigo:4,
                selecionado:true,
                horarioInicial: new Date(1970, 0, 1, 0, 0, 0),
                horarioFinal: new Date(1970, 0, 1, 23, 59, 59)
              },
              {
                nome:'Quinta-feira',
                codigo:5,
                selecionado:true,
                horarioInicial: new Date(1970, 0, 1, 0, 0, 0),
                horarioFinal: new Date(1970, 0, 1, 23, 59, 59)
              },
              {
                nome:'Sexta-feira',
                codigo:6,
                selecionado:true,
                horarioInicial: new Date(1970, 0, 1, 0, 0, 0),
                horarioFinal: new Date(1970, 0, 1, 23, 59, 59)
              },
              {
                nome:'Sábado',
                codigo:7,
                selecionado:true,
                horarioInicial: new Date(1970, 0, 1, 0, 0, 0),
                horarioFinal: new Date(1970, 0, 1, 23, 59, 59)
              },
              {
                nome:'Domingo',
                codigo:1,
                selecionado:true,
                horarioInicial: new Date(1970, 0, 1, 0, 0, 0),
                horarioFinal: new Date(1970, 0, 1, 23, 59, 59)
              }
            ]
          }
        );
      }
    };

    // Remove existing Mensalista
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.mensalista.$remove($state.go('mensalista.list'));
      }
    }

    // Save Mensalista
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mensalistaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.mensalista._id) {
        vm.mensalista.$update(successCallback, errorCallback);
      } else {
        vm.mensalista.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mensalista.view', {
          mensalistaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
