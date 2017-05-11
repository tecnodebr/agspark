'use strict';


var path = require('path'),
    fs = require('fs');

var seedRules = require('./rules');
var seedMenus = require('./menus');
var seedRoles = require('./roles');
var seedUsersBase = require('./users');

module.exports.seedAllBasics = seedAllBasics;

function seedAllBasics() {


  seedRules.seedAllRules().then(function(rules){
    console.log('SEED Rules:' + rules);
    seedMenus.seedAllMenus().then(function(menus){
      console.log('SEED Menus:' + menus);

      seedRoles.seedAllRoles().then(function(roles){
        console.log('SEED Roles:' + roles);
        seedUsersBase.seedAllUsers().then(function(users){
          console.log('SEED Users:' + users);
          console.log('SEED BASICS COMPLETED!!!');
        });
      });

    });
  });




}
