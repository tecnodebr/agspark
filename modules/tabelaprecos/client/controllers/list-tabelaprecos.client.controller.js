(function () {
  'use strict';

  angular
    .module('tabelaprecos')
    .controller('TabelaprecosListController', TabelaprecosListController);

  TabelaprecosListController.$inject = ['TabelaprecosService'];

  function TabelaprecosListController(TabelaprecosService) {
    var vm = this;

    vm.tabelaprecos = TabelaprecosService.query();
  }
})();
