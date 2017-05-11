'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  role = require('../controllers/admin/admin.roles.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users').all(global.authorization)
    .get(admin.list);

  // Single user routes
  app.route('/api/users/:userId').all(global.authorization)
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  app.route('/api/roles').all(global.authorization)
    .post(adminPolicy.isAllowed, role.create)
    .get(adminPolicy.isAllowed, role.list);

  app.route('/api/role/rules/:roleId').all(global.authorization)
      .get(adminPolicy.isAllowed, role.readWithRulesAssociation)
      .put(adminPolicy.isAllowed, role.updateRules);
  app.route('/api/roles/:roleId').all(global.authorization)
    .get(adminPolicy.isAllowed, role.read)
    .put(adminPolicy.isAllowed, role.update)
    .delete(adminPolicy.isAllowed, role.delete);



  app.route('/api/userrules/:userId').all(global.authorization)
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.updateRules)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
