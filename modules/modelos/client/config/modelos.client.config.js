(function () {
  'use strict';

  angular
    .module('modelos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    /*
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Modelos',
      state: 'modelos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'modelos', {
      title: 'List Modelos',
      state: 'modelos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'modelos', {
      title: 'Create Modelo',
      state: 'modelos.create',
      roles: ['user']
    });
    */
  }
})();
