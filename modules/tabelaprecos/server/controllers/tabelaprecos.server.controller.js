'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
  mongoose = require('mongoose'),
  Tabelapreco = mongoose.model('Tabelapreco'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
* Create a Tabelapreco
*/
exports.create = function(req, res) {
  var tabelapreco = new Tabelapreco(req.body);
  tabelapreco.user = req.user;

  tabelapreco.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tabelapreco);
    }
  });
};

/**
* Show the current Tabelapreco
*/
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var tabelapreco = req.tabelapreco ? req.tabelapreco.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  tabelapreco.isCurrentUserOwner = req.user && tabelapreco.user && tabelapreco.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(tabelapreco);
};

/**
* Update a Tabelapreco
*/
exports.update = function(req, res) {
  var tabelapreco = req.tabelapreco ;

  tabelapreco = _.extend(tabelapreco , req.body);

  tabelapreco.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tabelapreco);
    }
  });
};

/**
* Delete an Tabelapreco
*/
exports.delete = function(req, res) {
  var tabelapreco = req.tabelapreco ;

  tabelapreco.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tabelapreco);
    }
  });
};

/**
* List of Tabelaprecos
*/
exports.list = function(req, res) {
  Tabelapreco.find().sort('-created').populate('user', 'displayName').exec(function(err, tabelaprecos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tabelaprecos);
    }
  });
};

/**
* Tabelapreco middleware
*/
exports.tabelaprecoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tabelapreco is invalid'
    });
  }

  Tabelapreco
  .findById(id)
  .populate('user', 'displayName')
  .populate('precos')
  .exec(function (err, tabelapreco) {
    if (err) {
      return next(err);
    } else if (!tabelapreco) {
      return res.status(404).send({
        message: 'No Tabelapreco with that identifier has been found'
      });
    }
    req.tabelapreco = tabelapreco;
    next();
  });
};
