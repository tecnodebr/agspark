(function () {
  'use strict';

  angular
    .module('configuracoes')
    .controller('ConfiguracoesListController', ConfiguracoesListController);

  ConfiguracoesListController.$inject = ['ConfiguracoesService'];

  function ConfiguracoesListController(ConfiguracoesService) {
    var vm = this;

    vm.configuracoes = ConfiguracoesService.query();
  }
})();
