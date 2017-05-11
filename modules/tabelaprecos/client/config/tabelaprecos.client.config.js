(function () {
  'use strict';

  angular
  .module('tabelaprecos')
  .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Preços',
      state: 'tabelaprecos',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tabelaprecos', {
      title: 'Tabelas de preços',
      state: 'tabelaprecos.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tabelaprecos', {
      title: 'Criar nova tabela',
      state: 'tabelaprecos.create',
      roles: ['admin']
    });


    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tabelaprecos', {
      title: 'Faixas de preços',
      state: 'faixaprecos.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tabelaprecos', {
      title: 'Criar nova faixa',
      state: 'faixaprecos.create',
      roles: ['admin']
    });

  }
})();
