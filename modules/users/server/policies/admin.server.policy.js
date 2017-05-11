'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

var mongoose = require('mongoose'),
  Rule = mongoose.model('Rule'),
  Role = mongoose.model('Role');

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {

  // Role.find({ active : true }).populate('rules.rule.id').exec(function (err, roles) {
  //   if (err) {
  //     global.logger.erro(err);
  //   }
  //   var allRolesRouteAlow = [];
  //
  //   for(var r = 0; r < roles.length; r++) {
  //     var roleRouteAlow = {};
  //     var role = roles[r];
  //
  //     roleRouteAlow.roles = [role._id.toString()];
  //     roleRouteAlow.allows = [];
  //     for(var u = 0; u < role.rules.length; u++) {
  //       var rule = role.rules[u];
  //       if(rule.rule.id.route != null && rule.rule.id.route != undefined)
  //         roleRouteAlow.allows.push({ resources: rule.rule.id.route, permissions: rule.rule.id.permissions });
  //     }
  //     allRolesRouteAlow.push(roleRouteAlow);
  //   }
  //   acl.allow(allRolesRouteAlow);
  // });


  acl.allow([{
    roles:  ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }, {
      resources: '/api/userrules/:userId',
      permissions: '*'
    }, {
      resources: '/api/roles',
      permissions: '*'
    }, {
      resources: '/api/roles/:roleId',
      permissions: '*'
    }, {
      resources: '/api/role/rules',
      permissions: '*'
    }, {
      resources: '/api/role/rules/:roleId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).json({
        message: 'Unexpected authorization error'
      });
    }
    else {
      if (isAllowed) {
        return next();
      }
      else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
