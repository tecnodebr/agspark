'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  Empresa = mongoose.model('Empresa');

/**
 * Create a Empresa
 */
exports.create = function (req, res) {
  var empresa = new Empresa(req.body);
  empresa.user = req.user;
  empresa.logo.data = new Buffer(req.body.logo.base64, 'base64');

  empresa.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(empresa);
    }
  });
};

/**
 * Show the current Empresa
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var empresa = req.empresa ? req.empresa.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  empresa.isCurrentUserOwner = req.user && empresa.user && empresa.user._id.toString() === req.user._id.toString() ? true : false;
  if(empresa.logo.data != null && empresa.logo.data != '')
    empresa.logo.data = new Buffer(empresa.logo.data).toString('base64');
  else
    empresa.logo.data = null;
  res.jsonp(empresa);
};

/**
 * Update a Empresa
 */
exports.update = function (req, res) {
  var empresa = req.empresa;
  empresa = _.extend(empresa , req.body);
  if(req.body.logo.base64 != null)
    empresa.logo.data = new Buffer(req.body.logo.base64, 'base64');
  else {
    empresa.logo.data = '';
    empresa.logo.contentType = '';
  }
  empresa.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(empresa);
    }
  });
};

/**
 * Delete an Empresa
 */
exports.delete = function (req, res) {

};

/**
 * List of Empresas
 */
exports.list = function (req, res) {
  Empresa.find().sort('-created').populate('user', 'displayName').exec(function(err, empresa) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(empresa);
    }
  });
};

exports.empresaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Empresa is invalid'
    });
  }

  Empresa.findById(id).populate('user', 'displayName').exec(function (err, empresa) {
    if (err) {
      return next(err);
    } else if (!empresa) {
      return res.status(404).send({
        message: 'No empresa with that identifier has been found'
      });
    }

    req.empresa = empresa;
    next();
  });
};
