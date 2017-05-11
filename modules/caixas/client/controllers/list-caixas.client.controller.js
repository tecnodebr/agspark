(function () {
  'use strict';

  angular
    .module('caixas')
    .controller('CaixasListController', CaixasListController);

  CaixasListController.$inject = ['CaixasService'];

  function CaixasListController(CaixasService) {
    var vm = this;

    vm.caixas = CaixasService.query();
  }
})();
