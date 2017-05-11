(function () {
  'use strict';

  angular
    .module('backups')
    .controller('BackupsListController', BackupsListController);

  BackupsListController.$inject = ['BackupsService'];

  function BackupsListController(BackupsService) {
    var vm = this;

    vm.backups = BackupsService.query();
  }
})();
