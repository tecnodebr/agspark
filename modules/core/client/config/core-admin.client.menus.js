'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
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
      roles: ['admin']
    });

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Cadastrar novo usuário',
      state: 'authentication.signup',
      roles: ['admin']
    });

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Dados do ponto',
      state: 'empresa.create',
      roles: ['admin']
    });

    

  }
]);
