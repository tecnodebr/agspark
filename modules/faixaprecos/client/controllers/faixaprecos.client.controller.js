(function () {
  'use strict';

  // Faixaprecos controller
  angular
    .module('faixaprecos')
    .controller('FaixaprecosController', FaixaprecosController);

  FaixaprecosController.$inject = ['$scope', '$state', 'Authentication', 'faixaprecoResolve'];

  function FaixaprecosController ($scope, $state, Authentication, faixapreco) {
    var vm = this;

    vm.authentication = Authentication;
    vm.faixapreco = faixapreco;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Faixapreco
    function remove() {
      if (confirm('Tem certeza que deseja apagar?')) {
        vm.faixapreco.$remove($state.go('faixaprecos.list'));
      }
    }

    // Save Faixapreco
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.faixaprecoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.faixapreco._id) {
        vm.faixapreco.$update(successCallback, errorCallback);
      } else {
        vm.faixapreco.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('faixaprecos.view', {
          faixaprecoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
