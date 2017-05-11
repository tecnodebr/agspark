'use strict';

/**
 * Module dependencies
 */
var caixasPolicy = require('../policies/caixas.server.policy'),
  caixas = require('../controllers/caixas.server.controller');

module.exports = function(app) {
  // Caixas Routes
  app.route('/api/caixas').all(global.authorization)
    .get(caixas.list)
    .post(caixas.create);

    app.route('/api/statusCaixa')
      .get(caixas.statusCaixa);

  app.route('/api/caixas/:caixaId').all(global.authorization)
    .get(caixas.read)
    .put(caixas.update)
    .delete(caixas.delete);

  // Finish by binding the Caixa middleware
  app.param('caixaId', caixas.caixaByID);
};
