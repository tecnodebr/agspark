(function () {
  'use strict';

  // Backups controller
  angular
    .module('backups')
    .controller('BackupsController', BackupsController);

  BackupsController.$inject = ['$scope', '$state', '$http', '$location', 'Authentication', 'backupResolve'];

  function BackupsController ($scope, $state, $http, $location, Authentication, backup) {
    var vm = this;

    vm.authentication = Authentication;
    vm.backup = backup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.backupCreated = false;
    vm.backupfileName = '';
    $scope.createIFrameDownload = createIFrameDownload;

    // Remove existing Backup
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.backup.$remove($state.go('backups.list'));
      }
    }

    function createIFrameDownload(fileName){
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', fileName);
      iframe.setAttribute('style', 'display: none');
      document.body.appendChild(iframe);
    }

    // Save Backup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.backupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.backup._id) {
        vm.backup.$update(successCallback, errorCallback);
      } else {
        vm.backup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var fileName = '/backup/' + res.fileName;
        var link = angular.element(document.getElementById('downloadLink'));

        vm.backupCreated = true;
        vm.backupfileName = fileName;
        createIFrameDownload(vm.backupfileName);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
