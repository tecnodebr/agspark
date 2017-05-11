'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Configuracoes = mongoose.model('Configuracoes'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Configuracoes
 */
exports.create = function(req, res) {
  var configuracoes = new Configuracoes(req.body);
  configuracoes.user = req.user;

  configuracoes.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configuracoes);
    }
  });
};

/**
 * Show the current Configuracoes
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var configuracoes = req.configuracoes ? req.configuracoes.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  configuracoes.isCurrentUserOwner = req.user && configuracoes.user && configuracoes.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(configuracoes);
};

/**
 * Update a Configuracoes
 */
exports.update = function(req, res) {
  var configuracoes = req.configuracoes ;

  configuracoes = _.extend(configuracoes , req.body);

  configuracoes.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configuracoes);
    }
  });
};

/**
 * Delete an Configuraco
 */
exports.delete = function(req, res) {
  var configuracoes = req.configuracoes ;

  configuracoes.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configuracoes);
    }
  });
};

/**
 * List of Configuracoes
 */
exports.list = function(req, res) {
  Configuracoes.find().sort('-created').populate('user', 'displayName').exec(function(err, configuracoes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configuracoes);
    }
  });
};

/**
 * Configuracoes middleware
 */
exports.configuracoesByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Configuracoes is invalid'
    });
  }

  Configuracoes.findById(id).populate('user', 'displayName').exec(function (err, configuracoes) {
    if (err) {
      return next(err);
    } else if (!configuracoes) {
      return res.status(404).send({
        message: 'No Configuracoes with that identifier has been found'
      });
    }
    req.configuracoes = configuracoes;
    next();
  });
};
