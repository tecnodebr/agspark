(function () {
  'use strict';

  angular
    .module('mensalistavalor')
    .controller('MensalistaValorController', MensalistaValorController);

  MensalistaValorController.$inject = ['$scope', '$state', 'MensalistaValorService', 'mensalistaResolve'];

  function MensalistaValorController($scope, $state, MensalistaValorService, mensalistaResolve) {
    var vm = this;
    vm.mensalistavalorlista = MensalistaValorService.query();
    vm.mensalistavalor = mensalistaResolve;

    $scope.update = function(isValid){

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.vigenciaForm');
        return false;
      }

      vm.mensalistavalor.$save(successCallback, errorCallback);

      function successCallback(res) {
        $state.go('mensalistavalor.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
})();
