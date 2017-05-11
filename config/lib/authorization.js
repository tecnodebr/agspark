'use strict';

/**
* Module dependencies.
*/
var acl = require('acl'),
mongoose = require('mongoose'),
Rule = mongoose.model('Rule'),
Role = mongoose.model('Role');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
* Invoke Rules Permissions
*/
exports.invokeRolesPolicies = function () {
  return new Promise(function(resolve, reject) {
    Role.find({ active : true }).populate('rules.rule').exec(function (err, roles) {
      if (err) {
        global.logger.error(err);
        reject(err);
      }
      var allRolesRouteAlow = [];

      for(var r = 0; r < roles.length; r++) {
        var roleRouteAlow = {};
        var role = roles[r];
        roleRouteAlow.roles = [role._id.toString()];
        roleRouteAlow.allows = [];
        for(var u = 0; u < role.rules.length; u++) {
          var rule = role.rules[u];
          if (rule && rule.rule) {
            if(rule.rule.route != null && rule.rule.route != undefined)
              roleRouteAlow.allows.push({ resources: rule.rule.route, permissions: rule.permissions });
          }
        }
        allRolesRouteAlow.push(roleRouteAlow);
      }
      //console.log(JSON.stringify(allRolesRouteAlow));
      acl.allow(allRolesRouteAlow);
      resolve(acl);
    });
  });
};


/**
* Check If Rules Policy Allows
*/
exports.isAllowed = function (req, res, next) {
  var roles = [];

  if(req.user && req.user.roles) {
    req.user.roles.forEach(function(role){
      //Role.findOne({ _id: role.id }).populate('rules').exec(function (err, role) {
        roles.push(role);
        if(role.name)
          roles.push(role.name);
        });
    //});
  }
  //console.log(roles);
  var rolesAssociated = [];
  // If an rule is being processed and the current user created it then allow any manipulation
  if (req.user && req.user.username == 'admin') {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
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
