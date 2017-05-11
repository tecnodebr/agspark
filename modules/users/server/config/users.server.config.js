'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Module init function.
 */
module.exports = function (app, db) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      var options = {
        path: 'roles.menus.menu',
        model: 'Menu'
      };
      if(err){
          done(err, user);
      }
      else{
        mongoose.model('User').populate(user, options, function (err, res) {
          done(err, res);
        });
      }
    }).populate('roles');
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
