(function () {
  'use strict';

  // Configuracoes controller
  angular
    .module('empresa')
    .controller('EmpresaController', EmpresaController);

  EmpresaController.$inject = ['$scope', '$state', '$http', '$window', '$rootScope', 'Authentication', 'empresaResolve'];

  function EmpresaController ($scope, $state, $http, $window, $rootScope, Authentication, empresaResolve) {
    var vm = this;
    vm.authentication = Authentication;
    vm.empresa = empresaResolve;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    $scope.files = {};
    if(empresaResolve != null && empresaResolve != undefined && empresaResolve.logo != null && empresaResolve.logo != undefined)
    {
      $scope.files.base64 = empresaResolve.logo.data;
      $scope.files.filetype = empresaResolve.logo.contentType;
    }
    else
    {
      $scope.files.base64 = '';
      $scope.files.filetype = '';
    }

    $scope.deleteLogo = function() {
      $scope.files.base64 = '';
      $scope.files.filetype = '';
    };

    // Remove existing Configuracoes
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.empresa.$remove($state.go('empresa.list'));
      }
    }

    // Save Configuracoes
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.empresaForm');
        return false;
      }

      vm.empresa.logo = {};
      vm.empresa.logo.base64 = $scope.files.base64;
      vm.empresa.logo.contentType = $scope.files.filetype;

      // TODO: move create/update logic to service
      if (vm.empresa._id) {
        vm.empresa.$update(successCallback, errorCallback);
      } else {
        vm.empresa.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('empresa.view', {
          empresaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
