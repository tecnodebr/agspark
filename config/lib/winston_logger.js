'use strict';
var config = require('../config');
var winston = require('winston');
var winstondb = require('winston-mongodb');



//winston.add(winston.transports.MongoDB, options);

var logger = new (winston.Logger)({
   transports: [
       new(winston.transports.MongoDB)({
           db : config.db.uri,
           collection: 'log',
           level: 'info'
       }),
      new (winston.transports.Console)()
/*       ,
       new(winston.transports.MongoDB)({
           db : config.db.uri,
           collection: 'log-error',
           level: 'error'
       }),
       new(winston.transports.MongoDB)({
           db : config.db.uri,
           collection: 'log-debug',
           level: 'debug'
       })
       */
      ]
});

module.exports = logger;
