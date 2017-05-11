'use strict';

var mongoose = require('mongoose'),
    query = require('array-query'),
    Role = mongoose.model('Role'),
    Menu = mongoose.model('Menu');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};



/**
 * Render the server menus
 */
exports.menus = function (req, res) {
  var menusRoles = [];
  Menu.find().populate('submenus').exec(function(err, menus) {
    if (err) {
      global.logger.error(err);
      return res.status(404).send({
        message: JSON.stringify(err)
      });
    } else {
      Role.find().exec(function(err, roles) {
        if (err) {
          global.logger.error(err);
          return res.status(404).send({
            message: JSON.stringify(err)
          });
        } else {
          menus.forEach(function(menu){
            var roleMenuFound = query().filter(function(obj) {
                var menusFound = query.select(obj.menus).where('menu.toString()').is(menu._id.toString()).end();
                if(menusFound && menusFound.length > 0){
                  return true;
                }
                else{
                  return false;
                }
            }).on(roles);
            var rolesAdd = [];
            roleMenuFound.forEach(function(r){
              rolesAdd.push(r._id);
            });
            menusRoles.push({ menu : menu, roles : rolesAdd });
          });

          res.jsonp(menusRoles);
        }
      });
    }
  });
};
