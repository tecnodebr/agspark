'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Faixapreco = mongoose.model('Faixapreco'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Faixapreco
 */
exports.create = function(req, res) {
  var faixapreco = new Faixapreco(req.body);
  faixapreco.user = req.user;

  faixapreco.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(faixapreco);
    }
  });
};

/**
 * Show the current Faixapreco
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var faixapreco = req.faixapreco ? req.faixapreco.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  faixapreco.isCurrentUserOwner = req.user && faixapreco.user && faixapreco.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(faixapreco);
};

/**
 * Update a Faixapreco
 */
exports.update = function(req, res) {
  var faixapreco = req.faixapreco ;

  faixapreco = _.extend(faixapreco , req.body);

  faixapreco.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(faixapreco);
    }
  });
};

/**
 * Delete an Faixapreco
 */
exports.delete = function(req, res) {
  var faixapreco = req.faixapreco ;

  faixapreco.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(faixapreco);
    }
  });
};

/**
 * List of Faixaprecos
 */
exports.list = function(req, res) { 
  Faixapreco.find().sort('-created').populate('user', 'displayName').exec(function(err, faixaprecos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(faixaprecos);
    }
  });
};

/**
 * Faixapreco middleware
 */
exports.faixaprecoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Faixapreco is invalid'
    });
  }

  Faixapreco.findById(id).populate('user', 'displayName').exec(function (err, faixapreco) {
    if (err) {
      return next(err);
    } else if (!faixapreco) {
      return res.status(404).send({
        message: 'No Faixapreco with that identifier has been found'
      });
    }
    req.faixapreco = faixapreco;
    next();
  });
};
