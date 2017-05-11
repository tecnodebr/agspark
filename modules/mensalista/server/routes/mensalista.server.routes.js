'use strict';

/**
 * Module dependencies
 */
var mensalistaPolicy = require('../policies/mensalista.server.policy'),
  mensalista = require('../controllers/mensalista.server.controller');

var mensalistavigencias = require('../controllers/mensalistavigencias.server.controller');
var mensalistavalor = require('../controllers/mensalistavalor.server.controller');

module.exports = function(app) {
  // Mensalista Routes
  app.route('/api/mensalista').all(global.authorization)
    .get(mensalista.list)
    .post(mensalista.create);

  app.route('/api/mensalistavalor').all(global.authorization)
    .get(mensalistavalor.list)
    .post(mensalistavalor.create);

  app.route('/api/mensalista/:mensalistaId/vigencia').all(global.authorization)
    .get(mensalistavigencias.list)
    .post(mensalistavigencias.create);

  app.route('/api/mensalista/:mensalistaId/vigencia/:mensalistaVigenciaId').all(global.authorization)
    .get(mensalistavigencias.read)
    .put(mensalistavigencias.update);

  app.route('/api/mensalista/:mensalistaId/vigencia/:mensalistaVigenciaId/pay').all(global.authorization)
    .get(mensalistavigencias.read)
    .put(mensalistavigencias.pay);

  app.route('/api/mensalista/:mensalistaId').all(global.authorization)
    .get(mensalista.read)
    .put(mensalista.update)
    .delete(mensalista.delete);

  app.route('/api/mensalista/:mensalistaId/cancel').all(global.authorization)
      .get(mensalista.read)
      .put(mensalista.cancel);

  app.route('/api/mensalista/findByPlaca/:mensalistaPlaca').all(global.authorization)
    .get(mensalista.read);

  // Finish by binding the Mensalista middleware
  app.param('mensalistaId', mensalista.mensalistaByID);
  app.param('mensalistaVigenciaId', mensalistavigencias.mensalistaVigenciaByID);
  app.param('mensalistaPlaca', mensalista.mensalistaFindByPlaca);
};
