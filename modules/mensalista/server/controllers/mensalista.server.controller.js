'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
Mensalista = mongoose.model('Mensalista'),
MensalistaVigencias = mongoose.model('MensalistaVigencias'),
MensalistaBusiness = require(path.resolve('./modules/mensalista/server/business/mensalista.server.business.js')),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
query = require('array-query'),
_ = require('lodash');



/**
* Create a Mensalista
*/
exports.create = function(req, res) {
  var mensalista = new Mensalista(req.body);
  mensalista.user = req.user;
  mensalista.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      MensalistaBusiness.VerificaViradaNovaVigencia(mensalista, []).then(function(retorno){
        res.jsonp(mensalista);
      }).catch(function(er){
        return res.status(400).send({
          message: JSON.stringify(er)
        });
      });

    }
  });
};

/**
* Show the current Mensalista
*/
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mensalista = req.mensalista ? req.mensalista.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mensalista.isCurrentUserOwner = req.user && mensalista.user && mensalista.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(mensalista);
};

/**
* Update a Mensalista
*/
exports.update = function(req, res) {
  var mensalista = req.mensalista ;

  mensalista = _.extend(mensalista , req.body);

  mensalista.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mensalista);
    }
  });
};


/**
* cancel a Mensalista
*/
exports.cancel = function(req, res) {
  var mensalista = req.mensalista ;
  mensalista = _.extend(mensalista , req.body);
  var vigenciasPagas = [];

  MensalistaVigencias.find({ mensalista : mensalista._id, status : { $ne : 'pago' } }).exec(function(err, vigenciasPendetes) {
    vigenciasPendetes.forEach(function(vigencia){
      vigenciasPagas.push(MensalistaBusiness.EfetuarPagamentoMensalistaVigencia(vigencia));
    });
    Promise.all(vigenciasPagas).then(function(values) {
      var vgNaoPaga = query.select(values).where('status').not().is('pago').end();
      if(vgNaoPaga == null || vgNaoPaga == undefined || vgNaoPaga.length <= 0){
        mensalista.status = 'cancelado';
        mensalista.canceled = new Date();
        mensalista.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(mensalista);
          }
        });
      }
      else {
        return res.status(400).send({
          message: 'Mensalista possuí alguma mensalidade não paga'
        });
      }

    }).catch(function(err){
      return res.status(400).send({
        message: JSON.stringify(err)
      });
    });
  });
};

/**
* Delete an Mensalista
*/
exports.delete = function(req, res) {
  var mensalista = req.mensalista ;

  mensalista.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mensalista);
    }
  });
};

/**
* List of Mensalista
*/
exports.list = function(req, res) {
  Mensalista.find().sort('-created').populate('user', 'displayName').exec(function(err, mensalista) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mensalista);
    }
  });
};

/**
* Mensalista middleware
*/
exports.mensalistaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mensalista is invalid'
    });
  }

  Mensalista.findById(id).populate('carros.diasDaSemana').populate('user', 'displayName').exec(function (err, mensalista) {
    if (err) {
      return next(err);
    } else if (!mensalista) {
      return res.status(404).send({
        message: 'No Mensalista with that identifier has been found'
      });
    }
    req.mensalista = mensalista;
    next();
  });
};

exports.mensalistaFindByPlaca = function(req, res, next, placa) {
  if (!placa) {
    return res.status(400).send({
      message: 'Placa inválida'
    });
  }

  var letras = placa.substring(0,3).toUpperCase();
  var numeros = placa.substring(3,7);


  Mensalista.findOne(
    {
      'carros':
      {
        $elemMatch: { 'placaLetras':letras, 'placaNumeros':numeros }
      }
    }).populate('carros.diasDaSemana').populate('user', 'displayName').exec(function (err, mensalista) {
      if (err) {
        return next(err);
      }
      else {
        var diaEntrada = new Date(); diaEntrada.setHours(0,0,0,0);
        MensalistaVigencias.findOne({ mensalista : mensalista, 'periodovalidade.inicio' : { $lte: diaEntrada }, 'periodovalidade.fim' : { $gte: diaEntrada } }).exec(function (err, vigenciaAtual) {
          if (err) {
            return next(err);
          }
          else {
            if(vigenciaAtual == null || vigenciaAtual == undefined){
              return res.status(404).send({
                message: 'Mensalista não encontrado para essa placa.'
              });
            }
            req.mensalista = mensalista;
            next();
          }
        });
      }
    });
  };
