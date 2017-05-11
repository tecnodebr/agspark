(function () {
  'use strict';

  angular
    .module('backups')
    .run(menuConfig);

  menuConfig.$inject = ['Menus', 'Authentication'];

  function menuConfig(Menus, Authentication) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'Cópia de segurança',
    //   state: 'backups',
    //   type: 'dropdown',
    //   roles: ['user']
    // });
    //
    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'backups', {
    //   title: 'Criar',
    //   state: 'backups.create',
    //   roles: ['user']
    // });
    /*
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'backups', {
      title: 'List Backups',
      state: 'backups.list'
    });
    */


  }
})();
