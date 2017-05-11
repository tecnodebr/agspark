'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
MensalistaVigencias = mongoose.model('MensalistaVigencias'),
Mensalista = mongoose.model('Mensalista'),
MensalistaBusiness = require(path.resolve('./modules/mensalista/server/business/mensalista.server.business.js')),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
_ = require('lodash');

var CaixaModel = mongoose.model('Caixa');
var MensalistaBusiness = require(path.resolve('./modules/mensalista/server/business/mensalista.server.business.js'));


/**
* Create a MensalistaVigencias
*/
exports.create = function(req, res) {
  var mensalistavigencia = new MensalistaVigencias(req.body);
  mensalistavigencia.user = req.user;
  mensalistavigencia.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mensalistavigencia);
    }
  });
};

/**
* Show the current MensalistaVigencias
*/
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mensalistaVigencia = req.mensalistaVigencia ? req.mensalistaVigencia.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mensalistaVigencia.isCurrentUserOwner = req.user && mensalistaVigencia.user && mensalistaVigencia.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(mensalistaVigencia);
};


/**
* Update a MensalistaVigencias
*/
exports.update = function(req, res) {
  var mensalistaVigencia = req.mensalistaVigencia ;

  mensalistaVigencia = _.extend(mensalistaVigencia , req.body);
  var hoje = new Date();
  hoje.setHours(0,0,0);
  if(mensalistaVigencia.periodovalidade.fim > hoje){
    MensalistaBusiness.RecalculaValorVigenciaParcial(mensalistaVigencia).then(function(vg){
      vg.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(mensalistaVigencia);
        }
      });
    });
  }
  else {
    mensalistaVigencia.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(mensalistaVigencia);
      }
    });
  }
};


/**
* Pay a MensalistaVigencias
*/
exports.pay = function(req, res) {
  var mensalistaVigencia = req.mensalistaVigencia;
  MensalistaBusiness.EfetuarPagamentoMensalistaVigencia(mensalistaVigencia).then(function(resultado){
    res.jsonp(mensalistaVigencia);
  }).catch(function(err){
    return res.status(400).send({
      message: JSON.stringify(err)
    });
  });
};

/**
* List of MensalistaVigencias
*/
exports.list = function(req, res) {
  MensalistaVigencias.find().sort('-created').populate('mensalista').exec(function(err, mensalistavigencias) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mensalistavigencias);
    }
  });
};

exports.mensalistaVigenciaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'MensalistaVigencia is invalid'
    });
  }

  MensalistaVigencias.findById(id).populate('mensalista').populate('user', 'displayName').exec(function (err, mensalista) {
    if (err) {
      return next(err);
    } else if (!mensalista) {
      return res.status(404).send({
        message: 'No MensalistaVigencia with that identifier has been found'
      });
    }
    req.mensalistaVigencia = mensalista;
    next();
  });
};
