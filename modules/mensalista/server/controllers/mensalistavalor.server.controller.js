'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
MensalistaValor = mongoose.model('MensalistaValor'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
_ = require('lodash');


/**
* List of MensalistaValor
*/
exports.list = function(req, res) {
  MensalistaValor.find().sort('-created').populate('user', 'username').exec(function(err, mensalistaValor) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mensalistaValor);
    }
  });
};

/**
* Create a MensalistaValor
*/
exports.create = function(req, res) {
  var mensalistaValor = new MensalistaValor(req.body);
  mensalistaValor.user = req.user;
  var bulk = MensalistaValor.collection.initializeOrderedBulkOp();
  bulk.find({ ativo : true }).update({ $set: { ativo: false, disabled : new Date() } });
  bulk.execute(function (error, result) {
    mensalistaValor.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(mensalistaValor);
      }
    });
  });
};
