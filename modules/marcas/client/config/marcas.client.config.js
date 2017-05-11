(function () {
  'use strict';

  angular
    .module('marcas')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Cadastros',
      state: 'marcas',
      type: 'dropdown',
      roles: ['user']
    });

    // // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'marcas', {
    //   title: 'Lista de Marcas',
    //   state: 'marcas.list',
    //   roles: ['user']
    // });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'marcas', {
      title: 'Cadastrar nova Marca',
      state: 'marcas.create',
      roles: ['user']
    });

    // // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'marcas', {
    //   title: 'Lista de Modelos',
    //   state: 'modelos.list',
    //   roles: ['user']
    // });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'marcas', {
      title: 'Cadastrar novo Modelo',
      state: 'modelos.create',
      roles: ['user']
    });
  }
})();
