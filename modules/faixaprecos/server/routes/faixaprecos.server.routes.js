'use strict';

/**
 * Module dependencies
 */
var rulesPolicy = require('../../../users/server/policies/rules.server.policy'),
  faixaprecos = require('../controllers/faixaprecos.server.controller');



module.exports = function(app) {
  // Faixaprecos Routes
  app.route('/api/faixaprecos').all(global.authorization)
    .get(faixaprecos.list)
    .post(faixaprecos.create);

  app.route('/api/faixaprecos/:faixaprecoId').all(global.authorization)
    .get(faixaprecos.read)
    .put(faixaprecos.update)
    .delete(faixaprecos.delete);

  // Finish by binding the Faixapreco middleware
  app.param('faixaprecoId', faixaprecos.faixaprecoByID);
};
