(function () {
  'use strict';

  angular
    .module('faixaprecos')
    .controller('FaixaprecosListController', FaixaprecosListController);

  FaixaprecosListController.$inject = ['FaixaprecosService'];

  function FaixaprecosListController(FaixaprecosService) {
    var vm = this;

    vm.faixaprecos = FaixaprecosService.query();
  }
})();
