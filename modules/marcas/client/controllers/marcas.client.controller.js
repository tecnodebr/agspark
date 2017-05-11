(function () {
  'use strict';

  // Marcas controller
  angular
    .module('marcas')
    .controller('MarcasController', MarcasController);

  MarcasController.$inject = ['$scope', '$state', 'Authentication', 'marcaResolve'];

  function MarcasController ($scope, $state, Authentication, marca) {
    var vm = this;

    vm.authentication = Authentication;
    vm.marca = marca;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Marca
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.marca.$remove($state.go('marcas.list'));
      }
    }

    // Save Marca
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.marcaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.marca._id) {
        vm.marca.$update(successCallback, errorCallback);
      } else {
        vm.marca.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('marcas.view', {
          marcaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
