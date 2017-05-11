(function () {
  'use strict';

  angular
    .module('faixaprecos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    /*
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Faixaprecos',
      state: 'faixaprecos',
      type: 'dropdown',
      roles: ['*']
    });
    */

  }

})();
