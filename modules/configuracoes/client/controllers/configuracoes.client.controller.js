(function () {
  'use strict';

  // Configuracoes controller
  angular
    .module('configuracoes')
    .controller('ConfiguracoesController', ConfiguracoesController);

  ConfiguracoesController.$inject = ['$scope', '$state', 'Authentication', 'configuracoesResolve'];

  function ConfiguracoesController ($scope, $state, Authentication, configuracoes) {
    var vm = this;

    vm.authentication = Authentication;
    vm.configuracoes = configuracoes;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Configuracoes
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.configuracoes.$remove($state.go('configuracoes.list'));
      }
    }

    // Save Configuracoes
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.configuracoesForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.configuracoes._id) {
        vm.configuracoes.$update(successCallback, errorCallback);
      } else {
        vm.configuracoes.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('configuracoes.view', {
          configuracoesId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
