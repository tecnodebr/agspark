(function () {
  'use strict';

  angular
    .module('mensalista')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Mensalistas',
      state: 'mensalista',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'mensalista', {
      title: 'Lista de mensalistas',
      state: 'mensalista.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'mensalista', {
      title: 'Cadastrar novo mensalista',
      state: 'mensalista.create',
      roles: ['user']
    });
  }
})();
