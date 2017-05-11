
'use strict';

angular.module('core').run(['Menus', 'Authentication', '$http',
  function (Menus, Authentication, $http) {

    var MenusRoles = [];

     $http.get('/api/menus')
     .then(menusCallback, function(err){

     });

     function menusCallback(res){
       if(res && res.data){
         var dropdownMenu = query.select(res.data).where('menu.menutype').is('dropdown').end();
         Promise.resolve(
           dropdownMenu.forEach(function(ddi){
             var ddiFoud = query.select(MenusRoles).where('menu._id').is(ddi.menu._id).end();
             if(!ddiFoud || ddiFoud.length <= 0) {
               addSubItemRecursive(ddi, res.data).then(function(itemMenu){
                 MenusRoles.push(itemMenu);
               });
             }
           }))
          .then(function(){
            MenusRoles.forEach(function(menuRole){
              Menus.addMenuItem('topbar', {
                title: menuRole.menu.title,
                state: menuRole.menu.state,
                type: 'dropdown',
                roles: menuRole.roles
              });
              if(menuRole.menu.submenus){
                addSubMenu(menuRole);
              }
            });
          });
       }
     }


     function addSubItemRecursive(itemMenu, arrayMenu){
       return new Promise(function(resolve, reject) {
         if(itemMenu && itemMenu.menu && itemMenu.menu.submenus){
           itemMenu.menu.submenus.forEach(function(subItem, i){
             var subItemFound = query.select(arrayMenu).where('menu._id').is(subItem._id).end();
             if(subItemFound && subItemFound.length > 0){
               subItemFound = subItemFound[0];
               if(subItemFound.submenus && subItemFound.submenus.length > 0){
                 addSubItemRecursive(subItemFound, arrayMenu).then(function(){
                   subItem = subItemFound;
                 });
               }
               else {
                 itemMenu.menu.submenus[i] = subItemFound;
               }
             }
           });
         }
         resolve(itemMenu);
       });
     }

     function addSubMenu(itemMenu){
       if(itemMenu && itemMenu.menu && itemMenu.menu.submenus){
         itemMenu.menu.submenus.forEach(function(subItem){
           Menus.addSubMenuItem('topbar', itemMenu.menu.state, {
             title: subItem.menu.title,
             state: subItem.menu.state,
             roles: subItem.roles
           });
           if(subItem.menu.submenus) {
             addSubMenu(subItem);
           }
         });
       }
     }

  }
]);
