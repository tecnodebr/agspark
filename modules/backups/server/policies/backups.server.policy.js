'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Backups Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/backups',
      permissions: '*'
    }, {
      resources: '/api/backups/:backupId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/backups',
      permissions: ['get', 'post']
    }, {
      resources: '/api/backups/:backupId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/backups',
      permissions: ['get']
    }, {
      resources: '/api/backups/:backupId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Backups Policy Allows
 */
exports.isAllowed = function (req, res, next) {

    return next();

  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Backup is being processed and the current user created it then allow any manipulation
  if (req.backup && req.user && req.backup.user && req.backup.user.id === req.user.id) {
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
