'use strict';

/**
 * Module dependencies
 */
var entradaveiculosPolicy = require('../policies/entradaveiculos.server.policy'),
  entradaveiculos = require('../controllers/entradaveiculos.server.controller');

module.exports = function(app) {
  // Entradaveiculos Routes
  app.route('/api/entradaveiculos').all(global.authorization)
    .get(entradaveiculos.list)
    .post(entradaveiculos.create);

  app.route('/api/entradaveiculos/:entradaveiculoId').all(global.authorization)
    .get(entradaveiculos.read)
    .put(entradaveiculos.update)
    .delete(entradaveiculos.delete);

  app.route('/api/saidaveiculos/:entradaveiculoId/permanencia').all(global.authorization)
      .get(entradaveiculos.horariospermanencia);

  app.route('/api/saidaveiculos/:entradaveiculoId/:tabelaprecoId').all(global.authorization)
      .get(entradaveiculos.calcularsaida);

  // Finish by binding the Entradaveiculo middleware
  app.param('entradaveiculoId', entradaveiculos.entradaveiculoByID);
};
