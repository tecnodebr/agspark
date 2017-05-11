'use strict';

var empresa = require('../controllers/empresa.server.controller');

module.exports = function(app) {

  app.route('/api/empresa').all(global.authorization)
    .get(empresa.list)
    .post(empresa.create);

  app.route('/api/empresa/:empresaId').all(global.authorization)
    .get(empresa.read)
    .put(empresa.update)
    .delete(empresa.delete);

    app.param('empresaId', empresa.empresaByID);
};
