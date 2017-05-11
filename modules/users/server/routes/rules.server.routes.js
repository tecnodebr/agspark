'use strict';

/**
 * Module dependencies.
 */
var rulesPolicy = require('../policies/rules.server.policy'),
  rules = require('../controllers/rules.server.controller');

module.exports = function (app) {
  // Rules collection routes
  app.route('/api/rules').all(global.authorization)
    .get(rules.list)
    .post(rules.create);

  // Single rule routes
  app.route('/api/rules/:ruleId').all(global.authorization)
    .get(rules.read)
    .put(rules.update)
    .delete(rules.delete);

  // Finish by binding the rules middleware
  app.param('ruleId', rules.ruleByID);
};
