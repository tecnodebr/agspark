'use strict';


var path = require('path'),
    fs = require('fs');

var mongoose = require('mongoose');
var Menu = mongoose.model('Menu');
var seedMenuData = require(path.resolve('./seed_data/menus/menus.json'));

module.exports.seedAllMenus = seedAllMenus;

function seedAllMenus() {
  return seedMenuList();
}

function seedMenuItem(item){
  return new Promise(function(resolve, reject) {
    if(item){
      if(item.submenus){
        var subMenusPromissesArray = [];
        item.submenus.forEach(function(subItem){
          subMenusPromissesArray.push(seedMenuItem(subItem));
        });
        Promise.all(subMenusPromissesArray).then(function(submenus){
          Menu.findOne({ state : item.state }).exec(function (err, menuFound) {
            if(err){
              global.logger.error('[SEED]', { mensagem : JSON.stringify(err) });
              reject(err);
            }
            var newMenu = {};
            if(menuFound){
              newMenu = menuFound;
            }
            else {
              newMenu = new Menu();
              newMenu.title = item.title;
              newMenu.state = item.state;
              if(item.type)
                newMenu.menutype = item.type;
            }
            if(newMenu && newMenu.submenus){
              newMenu.submenus.splice(0, newMenu.submenus.length);
            }
            else {
              newMenu.submenus = [];
            }
            if(submenus){
              submenus.forEach(function(subItemTemp){
                newMenu.submenus.push(subItemTemp);
              });
            }
            resolve(newMenu);
          });
        });
      }
      else {
        Menu.findOne({ state : item.state }).exec(function (err, menuFound) {
          var newMenu = {};
          if(menuFound){
            newMenu = menuFound
          }
          else {
            newMenu = new Menu();
            newMenu.title = item.title;
            newMenu.state = item.state;
            if(item.type)
              newMenu.menutype = item.type;
          }
          newMenu.save(function(err) {
            if (err) {
              global.logger.error('[SEED]', { mensagem : JSON.stringify(err) });
              reject(err);
            } else {
              resolve(newMenu);
            }
          });

        });
      }
    }
  });
}


function seedMenuList(){
  var menusPromissesArray = [];
  return new Promise(function(resolve, reject) {
    seedMenuData.menus.forEach(function(menu){
      menusPromissesArray.push(new Promise(function(resolveItem, rejectItem) {
        seedMenuItem(menu).then(function(menuData){
          Menu.findOne({ state : menuData.state }).exec(function (err, menuFound) {
            if(menuFound){
              menuFound.remove(function(err) {
                if (err) {
                  global.logger.error('[SEED menu remove]', { mensagem : JSON.stringify(err) });
                  rejectItem(err);
                } else {
                  menuData
                  menuData.save(function(err) {
                    if (err) {
                      global.logger.error('[SEED menu save]', { mensagem : JSON.stringify(err) });
                      rejectItem(err);
                    } else {
                      resolveItem(menuData);
                    }
                  });
                }
              });
            }
            else {
              menuData.save(function(err) {
                if (err) {
                  global.logger.error('[SEED menu save2]', { mensagem : JSON.stringify(err) });
                  rejectItem(err);
                } else {
                  resolveItem(menuData);
                }
              });
            }
          });
        });
      }));
    });
    Promise.all(menusPromissesArray)
      .then(function(menus){ resolve(menus); })
      .catch(function(err){ global.logger.error('[SEED menu Promise]', { mensagem : JSON.stringify(err) }); reject(err); });
  });
}
