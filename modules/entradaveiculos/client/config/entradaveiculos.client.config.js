(function () {
  'use strict';

  angular
    .module('entradaveiculos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Movimento',
      state: 'entradaveiculos',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'entradaveiculos', {
      title: 'Pátio',
      state: 'entradaveiculos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'entradaveiculos', {
      title: 'Registrar entrada',
      state: 'entradaveiculos.create',
      roles: ['user']
    });

/*
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'entradaveiculos', {
      title: 'List Caixas',
      state: 'caixas.list'
    });
*/
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'entradaveiculos', {
      title: 'Controle de Caixa',
      state: 'caixas.create',
      roles: ['user']
    });
  }
})();
