'use strict';

/**
 * Module dependencies
 */
var marcasPolicy = require('../policies/marcas.server.policy'),
  marcas = require('../controllers/marcas.server.controller');

module.exports = function(app) {
  // Marcas Routes
  app.route('/api/marcas').all(global.authorization)
    .get(marcas.list)
    .post(marcas.create);

  app.route('/api/marcas/:marcaId').all(global.authorization)
    .get(marcas.read)
    .put(marcas.update)
    .delete(marcas.delete);

  // Finish by binding the Marca middleware
  app.param('marcaId', marcas.marcaByID);
};
