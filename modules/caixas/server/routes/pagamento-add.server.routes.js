'use strict';

/**
 * Module dependencies
 */
var pagamentoAdd = require('../controllers/pagamento-add.server.controller');

module.exports = function(app) {
  // Caixas Routes
  app.route('/api/pay').all(global.authorization)
    .put(pagamentoAdd.pay);
};
