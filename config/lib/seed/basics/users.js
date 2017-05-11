'use strict';

var path = require('path'),
    fs = require('fs'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Role = mongoose.model('Role');

module.exports.seedAllUsers = seedAllUsers;

function seedAllUsers() {
  var usersPromiseArray = [];
  var seedUserData = {};
  return new Promise(function(resolve, reject) {
    config.utils.getGlobbedPaths('./seed_data/users/*.json').forEach(function (userFile) {
      seedUserData = require(path.resolve(userFile.toString()));
      console.log(seedUserData);
      usersPromiseArray.push(seedUserList(seedUserData));
    });
    Promise.all(usersPromiseArray)
      .then(function(users){ resolve(users); })
      .catch(function(err){ global.logger.error('[SEED]', { mensagem : JSON.stringify(err) }); reject(err) })
  });
}


function getSeedRoles(userSeed)
{
  return new Promise(function(resolve, reject) {
    var rolesPromissesArray = [];
    userSeed.roles.forEach(function(role){
      rolesPromissesArray.push(new Promise(function(resolveItem, rejectItem) {
        Role.findOne({ name : role }).exec(function (err, roleFound) {
          if(err){
            global.logger.error('[SEED]', { mensagem : JSON.stringify(err) });
            rejectItem(err);
          }
          if(roleFound)
            resolveItem(roleFound)
          else{
            global.logger.error('[SEED]', { mensagem : JSON.stringify(err) });
            rejectItem(err);
          }
        });
      }));
    });
    Promise.all(rolesPromissesArray)
      .then(function(roles){ resolve(roles); })
      .catch(function(err){ global.logger.error('[SEED]', { mensagem : JSON.stringify(err) }); reject(err) });
  });
}

function seedUserList(userData){
  var newUser = new User();
  return new Promise(function(resolve, reject) {
    User.findOne({ username : userData.user.username }).exec(function (err, userFound) {
      if(userFound){
        newUser = userFound;
      }
      if(newUser.roles){
        newUser.roles.splice(0, newUser.roles.length);
      }

      getSeedRoles(userData.user).then(function(roles){

        if(roles){
          roles.forEach(function(role){
            newUser.roles.push(role);
          });
        }


        newUser.firstName = userData.user.firstName;
        newUser.lastName = userData.user.lastName;
        newUser.displayName = userData.user.displayName;
        newUser.email = userData.user.email;
        newUser.username = userData.user.username;
        newUser.password = userData.user.password;
        newUser.profileImageURL = userData.user.profileImageURL;
        newUser.provider = userData.user.provider;

        console.log(newUser);
        newUser.save(function(err) {
          if (err) {
            global.logger.error('[SEED]', { mensagem : JSON.stringify(err) });
            reject(err);
          } else {
            resolve(newUser);
          }
        });

      });
    });
  });
}
