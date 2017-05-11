'use strict';

/**
 * Module dependencies
 */
var tabelaprecosPolicy = require('../policies/tabelaprecos.server.policy'),
  tabelaprecos = require('../controllers/tabelaprecos.server.controller');

module.exports = function(app) {
  // Tabelaprecos Routes
  app.route('/api/tabelaprecos').all(global.authorization)
    .get(tabelaprecos.list)
    .post(tabelaprecos.create);

  app.route('/api/tabelaprecos/:tabelaprecoId').all(global.authorization)
    .get(tabelaprecos.read)
    .put(tabelaprecos.update)
    .delete(tabelaprecos.delete);

  // Finish by binding the Tabelapreco middleware
  app.param('tabelaprecoId', tabelaprecos.tabelaprecoByID);
};
