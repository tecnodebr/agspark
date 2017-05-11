'use strict';


var path = require('path'),
    fs = require('fs'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

var mongoose = require('mongoose');
var Rule = mongoose.model('Rule');
var Menu = mongoose.model('Menu');
var Role = mongoose.model('Role');

module.exports.seedAllRoles = seedAllRoles;

function seedAllRoles() {
  var rolesPromiseArray = [];
  var seedRoleData = {};
  return new Promise(function(resolve, reject) {
    config.utils.getGlobbedPaths('./seed_data/roles/*.json').forEach(function (roleFile) {
      seedRoleData = require(path.resolve(roleFile.toString()));
      rolesPromiseArray.push(seedRoleList(seedRoleData));
    });
    Promise.all(rolesPromiseArray)
      .then(function(roles){ resolve(roles); })
      .catch(function(err){ global.logger.error('[SEED rolesPromiseArray]', { mensagem : JSON.stringify(err) }); reject(err) })
  });
}



function getSeedRules(roleSeed)
{
  return new Promise(function(resolve, reject) {
    var rulesPromissesArray = [];
    roleSeed.rules.forEach(function(rule){
      rulesPromissesArray.push(new Promise(function(resolveItem, rejectItem) {
        Rule.findOne({ name : rule.name }).exec(function (err, ruleFound) {
          if(err){
            global.logger.error('[SEED getSeedRules findOne]', { mensagem : JSON.stringify(err) });
            rejectItem(err);
          }
          if(ruleFound)
            resolveItem({ rule: ruleFound, permissions: rule.permissions })
          else{
            global.logger.error('[SEED rule not found]', { mensagem : JSON.stringify(err) });
            rejectItem(err);
          }
        });
      }));
    });
    Promise.all(rulesPromissesArray)
      .then(function(rules){ resolve(rules); })
      .catch(function(err){ global.logger.error('[SEED rulesPromissesArray]', { mensagem : JSON.stringify(err) }); reject(err) });
  });
}


function getSeedMenus(roleSeed)
{
  return new Promise(function(resolve, reject) {
    var menusPromissesArray = [];
    roleSeed.menus_state.forEach(function(menu){
      menusPromissesArray.push(new Promise(function(resolveItem, rejectItem) {
        Menu.findOne({ state : menu }).exec(function (err, menuFound) {

          if(err){
            global.logger.error('[SEED getSeedMenus findOne]', { mensagem : JSON.stringify(err) });
            rejectItem(err);
          }
          if(menuFound)
            resolveItem({ menu: menuFound })
          else{
            global.logger.error('[SEED getSeedMenus not menuFound]', { mensagem : JSON.stringify(err), Menu : menu });
            rejectItem(err);
          }
        });
      }));
    });
    Promise.all(menusPromissesArray)
      .then(function(menus){ resolve(menus); })
      .catch(function(err){ global.logger.error('[SEED menusPromissesArray]', { mensagem : JSON.stringify(err) }); reject(err) });
  });
}


function seedRoleList(roleData){
  var newRole = new Role();
  return new Promise(function(resolve, reject) {
    Role.findOne({ name : roleData.role.name }).exec(function (err, menuFound) {
      if(menuFound){
        newRole = menuFound;
      }
      if(newRole.rules){
        newRole.rules.splice(0, newRole.rules.length);
      }
      if(newRole.menus){
        newRole.menus.splice(0, newRole.menus.length);
      }

      getSeedRules(roleData.role).then(function(rules){
        if(rules){
          rules.forEach(function(rule){
            newRole.rules.push(rule);
          });
        }
        getSeedMenus(roleData.role).then(function(menus){
          if(menus){
            menus.forEach(function(menu){
              newRole.menus.push(menu);
            });
          }
          newRole.name = roleData.role.name;
          newRole.active = true;
          newRole.save(function(err) {
            if (err) {
              global.logger.error('[SEED roles save]', { mensagem : JSON.stringify(err) });
              reject(err);
            } else {
              resolve(newRole);
            }
          });
        });
      });
    });
  });
}
