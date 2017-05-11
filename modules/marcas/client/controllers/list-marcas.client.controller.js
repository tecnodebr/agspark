(function () {
  'use strict';

  angular
    .module('marcas')
    .controller('MarcasListController', MarcasListController);

  MarcasListController.$inject = ['MarcasService'];

  function MarcasListController(MarcasService) {
    var vm = this;

    vm.marcas = MarcasService.query();
  }
})();
