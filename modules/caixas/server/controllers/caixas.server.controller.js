'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
Caixa = mongoose.model('Caixa'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
_ = require('lodash'),
CaixaService = require(path.resolve('./modules/caixas/server/controllers/caixa.service'));

/**
* Create a Caixa
*/
exports.create = function(req, res) {
  var caixa = new Caixa(req.body);
  caixa.user = req.user;

  CaixaService.registra(caixa, trataErro);

  function trataErro(err, caixa){
    if (err) {
      return res.status(400).send({
        message: err
      });
    }else {
      res.jsonp(caixa);
    }
  }
};

/**
* Show the current Caixa
*/
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var caixa = req.caixa ? req.caixa.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  caixa.isCurrentUserOwner = req.user && caixa.user && caixa.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(caixa);
};

/**
* Update a Caixa
*/
exports.update = function(req, res) {
  var caixa = req.caixa ;

  caixa = _.extend(caixa , req.body);

  caixa.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(caixa);
    }
  });
};

/**
* Delete an Caixa
*/
exports.delete = function(req, res) {
  var caixa = req.caixa ;

  caixa.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(caixa);
    }
  });
};

/**
* List of Caixas
*/
exports.list = function(req, res) {
  Caixa.find().sort('-created').populate('user', 'displayName').exec(function(err, caixas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(caixas);
    }
  });
};

exports.statusCaixa = function(req, res){

  // Procura um caixa aberto para o usuário
  Caixa.find({ tipoEntrada:'ABERTURA', user: req.user }).populate('user').sort({ created:-1 }).limit(1).exec(function(err, caixaAbertura) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (caixaAbertura.length == 0) {
        res.end();  // Se não existe caixa retorna nada
      } else {
        // Verifica se o caixa não foi fechado ainda, se ele ainda estiver aberto não deixa abrir um novo.
        Caixa.findOne({ tipoEntrada:'FECHAMENTO', registroDeAbertura: caixaAbertura[0] }).exec(function(err, caixaFechado){
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            if (!caixaFechado) {
              Caixa.find({ registroDeAbertura: caixaAbertura[0] }).populate('user').exec(function(err, registrosDoCaixa){
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  var resumoCaixa = { caixaAberto: caixaAbertura[0], registros: registrosDoCaixa };
                  res.jsonp(resumoCaixa);
                }
              });

            } else {
              res.end();
            }
          }
        });
      }
    }
  });
};

/**
* Caixa middleware
*/
exports.caixaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Caixa is invalid'
    });
  }

  Caixa.findById(id).populate('user', 'displayName').exec(function (err, caixa) {
    if (err) {
      return next(err);
    } else if (!caixa) {
      return res.status(404).send({
        message: 'No Caixa with that identifier has been found'
      });
    }
    req.caixa = caixa;
    next();
  });
};
