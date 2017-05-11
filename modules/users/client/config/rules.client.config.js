'use strict';

// Configuring the rules module
angular.module('rules').run(['Menus',
  function (Menus) {
    // Add the rules dropdown item
    //Menus.addMenuItem('topbar', {
    //  title: 'Rules',
    //  state: 'rules',
    //  type: 'dropdown',
    //  roles: ['*']
    //});

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Listar regras',
      state: 'rules.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Criar nova regra',
      state: 'rules.create',
      roles: ['admin']
    });
  }
]);
