'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Modelo = mongoose.model('Modelo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Modelo
 */
exports.create = function(req, res) {
  var modelo = new Modelo(req.body);
  modelo.user = req.user;

  modelo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(modelo);
    }
  });
};

/**
 * Show the current Modelo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var modelo = req.modelo ? req.modelo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  modelo.isCurrentUserOwner = req.user && modelo.user && modelo.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(modelo);
};

/**
 * Update a Modelo
 */
exports.update = function(req, res) {
  var modelo = req.modelo ;

  modelo = _.extend(modelo , req.body);

  modelo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(modelo);
    }
  });
};

/**
 * Delete an Modelo
 */
exports.delete = function(req, res) {
  var modelo = req.modelo ;

  modelo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(modelo);
    }
  });
};

/**
 * List of Modelos
 */
exports.list = function(req, res) {
  Modelo.find({}, { nome:1, marca:1, _id:0 }).populate('user', 'displayName').populate('marca', { 'nome':1, 'categoriaVeiculo':1, '_id':0 }).exec(function(err, modelos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(modelos);
    }
  });
};

/**
 * Modelo middleware
 */
exports.modeloByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Modelo is invalid'
    });
  }

  Modelo.findById(id).populate('user', 'displayName').exec(function (err, modelo) {
    if (err) {
      return next(err);
    } else if (!modelo) {
      return res.status(404).send({
        message: 'No Modelo with that identifier has been found'
      });
    }
    req.modelo = modelo;
    next();
  });
};
