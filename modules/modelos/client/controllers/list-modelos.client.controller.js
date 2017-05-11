(function () {
  'use strict';

  angular
    .module('modelos')
    .controller('ModelosListController', ModelosListController);

  ModelosListController.$inject = ['ModelosService'];

  function ModelosListController(ModelosService) {
    var vm = this;

    vm.modelos = ModelosService.query();
  }
})();
