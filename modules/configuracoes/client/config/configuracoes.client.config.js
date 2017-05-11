(function () {
  'use strict';

  angular
    .module('configuracoes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    /*
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Configuracoes',
      state: 'configuracoes',
      type: 'dropdown',
      roles: ['*']
    });


    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Configurações',
      state: 'configuracoes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Criar nova configuração',
      state: 'configuracoes.create',
      roles: ['user']
    });
    */
  }
})();
