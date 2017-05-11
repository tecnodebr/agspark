(function () {
  'use strict';

  angular
    .module('mensalistavigencias')
    .controller('MensalistaVigenciasController', MensalistaVigenciasController);

  MensalistaVigenciasController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'MensalistaVigenciasService'];

  function MensalistaVigenciasController($scope, $rootScope, $state, Authentication, MensalistaVigenciasService) {
    var vm = this;
    vm.VigenciasApi = MensalistaVigenciasService.Vigencia;
    vm.error = null;
    vm.mensalista = {};
    vm.vigencia = {};

    vm.mensalistavigencias = MensalistaVigenciasService.MensalistaVigencias.query({ mensalistaId : $state.params.mensalistaId }, function(data){
      if(vm.mensalistavigencias.length > 0){
        vm.mensalista = vm.mensalistavigencias[0].mensalista;
      }
    });

    if($state.params.mensalistaVigenciaId != null && $state.params.mensalistaVigenciaId != undefined){
      vm.VigenciasApi.get({ mensalistaId : $state.params.mensalistaId, mensalistaVigenciaId : $state.params.mensalistaVigenciaId }, function(data) {
        vm.vigencia = data;
        if(vm.vigencia.vigencia.mes != undefined){
          var pad = '00';
          var mes = pad.substring(0, 2 - vm.vigencia.vigencia.mes.toString().length) + vm.vigencia.vigencia.mes.toString();
          vm.vigencia.vigencia.mes = mes;
        }
        vm.vigencia.periodovalidade.inicio = new Date(vm.vigencia.periodovalidade.inicio);
        vm.vigencia.periodovalidade.fim = new Date(vm.vigencia.periodovalidade.fim);
        $scope.formapagamentototal = vm.vigencia.valor;
      });
    }

    $scope.update = function(isValid){

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.vigenciaForm');
        return false;
      }

      vm.vigencia.$update(successCallback, errorCallback);

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
