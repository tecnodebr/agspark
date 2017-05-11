'use strict';

/**
 * Module dependencies
 */
var backups = require('../controllers/backups.server.controller');

module.exports = function(app) {
  // Backups Routes
  app.route('/api/backups').all(global.authorization)
    //.get(backups.list)
    .post(backups.create);

  // app.route('/api/backups/:backupId').all(global.authorization)
  //  .get(backups.read);
  //   .put(backups.update)
  //   .delete(backups.delete);
  //
  // // Finish by binding the Backup middleware
  // app.param('backupId', backups.backupByID);
};
