'use strict';

/**
 * Module dependencies
 */
var modelosPolicy = require('../policies/modelos.server.policy'),
  modelos = require('../controllers/modelos.server.controller');

module.exports = function(app) {
  // Modelos Routes
  app.route('/api/modelos').all(global.authorization)
    .get(modelos.list)
    .post(modelos.create);

  app.route('/api/modelos/:modeloId').all(global.authorization)
    .get(modelos.read)
    .put(modelos.update)
    .delete(modelos.delete);

  // Finish by binding the Modelo middleware
  app.param('modeloId', modelos.modeloByID);
};
