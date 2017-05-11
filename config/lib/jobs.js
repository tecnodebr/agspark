'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
    path = require('path');

const domain = require('domain');
const d = domain.create();

/**
 * Invoke modules server jobs
 */
module.exports.initJobs = function (db) {

  d.on('error', (er) => {
    global.logger.error('[JOB]', { mensagem : JSON.stringify(er) });
  });

  d.run(() => {
    config.files.server.jobs.forEach(function (configPath) {
      require(path.resolve(configPath)).start();
    });      
  });
};


/**
 * Initialize the Jobs application
 */
module.exports.init = function (db) {

  // Initialize local variables
  this.initJobs(db);

  return this;
};
