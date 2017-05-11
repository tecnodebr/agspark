'use strict';

/**
 * Module dependencies
 */
var configuracoesPolicy = require('../policies/configuracoes.server.policy'),
  configuracoes = require('../controllers/configuracoes.server.controller');

module.exports = function(app) {
  // Configuracoes Routes
  app.route('/api/configuracoes').all(global.authorization)
    .get(configuracoes.list)
    .post(configuracoes.create);

  app.route('/api/configuracoes/:configuracoesId').all(global.authorization)
    .get(configuracoes.read)
    .put(configuracoes.update)
    .delete(configuracoes.delete);

  // Finish by binding the Configuracoes middleware
  app.param('configuracoesId', configuracoes.configuracoesByID);
};
