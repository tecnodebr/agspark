'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Entradaveiculos Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/entradaveiculos',
      permissions: '*'
    }, {
      resources: '/api/entradaveiculos/:entradaveiculoId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/entradaveiculos',
      permissions: ['get', 'post']
    }, {
      resources: '/api/entradaveiculos/:entradaveiculoId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/entradaveiculos',
      permissions: ['get']
    }, {
      resources: '/api/entradaveiculos/:entradaveiculoId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Entradaveiculos Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Entradaveiculo is being processed and the current user created it then allow any manipulation
  if (req.entradaveiculo && req.user && req.entradaveiculo.user && req.entradaveiculo.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
