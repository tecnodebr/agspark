(function () {
  'use strict';

  angular
    .module('mensalista')
    .controller('MensalistaListController', MensalistaListController);

  MensalistaListController.$inject = ['MensalistaService'];

  function MensalistaListController(MensalistaService) {
    var vm = this;

    vm.mensalista = MensalistaService.query();
  }
})();
