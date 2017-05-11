(function () {
  'use strict';

  angular
    .module('caixas')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
/*
    Menus.addMenuItem('topbar', {
      title: 'Caixas',
      state: 'caixas',
      type: 'dropdown',
      roles: ['*']
    });
*/
  
  }
})();
