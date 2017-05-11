(function () {
  'use strict';

  // Modelos controller
  angular
    .module('modelos')
    .controller('ModelosController', ModelosController);

  ModelosController.$inject = ['$scope', '$state', 'Authentication', 'modeloResolve'];

  function ModelosController ($scope, $state, Authentication, api) {
    var vm = this;

    vm.authentication = Authentication;
    vm.modelo = api.modelo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.marca = api.marca.query();
    vm.marcaSelecionada = {};


    // Remove existing Modelo
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.modelo.$remove($state.go('modelos.list'));
      }
    }

    // Save Modelo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.modeloForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.modelo._id) {
        vm.modelo.$update(successCallback, errorCallback);
      } else {
        vm.modelo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('modelos.view', {
          modeloId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
