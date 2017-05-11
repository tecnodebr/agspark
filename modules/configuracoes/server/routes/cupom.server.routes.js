'use strict';

var cupom = require('../controllers/cupom.server.controller');

module.exports = function(app) {

  app.route('/api/cupom/entrada/:entradaveiculoId').all(global.authorization)
    .get(cupom.entradaveiculo);

  app.param('cupomId', cupom.cupomByID);
};
