'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
CaixaModel = mongoose.model('Caixa'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
_ = require('lodash'),
CaixaService = require(path.resolve('./modules/caixas/server/controllers/caixa.service'));


exports.pay = function (req, res){
  var pagamentosEfetuar = req.body.pagamentos;
  var origem = req.body.origem;
  var troco = req.body.troco;
  var pagamentos = [];

  for (var i = 0; i < pagamentosEfetuar.length; i++) {
    var caixaModel = new CaixaModel();
    caixaModel.valor = pagamentosEfetuar[i].Valor;
    //caixaModel.entradaveiculo = entradaveiculo;
    caixaModel.formaDePagamento = pagamentosEfetuar[i].FormaPagamento.toUpperCase();
    if (caixaModel.formaDePagamento === 'CARTAO') {
      caixaModel.formaDePagamento = 'CARTAOCREDITO';
    }
    if(origem) {
      if(origem.entradaveiculo){
        caixaModel.entradaveiculo = origem.entradaveiculo;
      }
      if(origem.mensalistavigencias){
        caixaModel.mensalistavigencias = origem.mensalistavigencias;
      }
    }
    caixaModel.tipoEntrada = 'ENTRADA';
    caixaModel.user = req.user;
    pagamentos.push(caixaModel);
  }

  if(troco && troco > 0){
    var caixaTroco = new CaixaModel();
    caixaTroco.valor = -Math.abs(troco);
    //caixaModel.entradaveiculo = entradaveiculo;
    caixaTroco.formaDePagamento = 'DINHEIRO';
    if(origem) {
      if(origem.entradaveiculo){
        caixaTroco.entradaveiculo = origem.entradaveiculo;
      }
      if(origem.mensalistavigencias){
        caixaTroco.mensalistavigencias = origem.mensalistavigencias;
      }
    }
    caixaTroco.tipoEntrada = 'SAIDA';
    caixaTroco.user = req.user;
    pagamentos.push(caixaTroco);
  }

  CaixaService.registraArray(pagamentos, callbackRegistra);

  function callbackRegistra(err, caixa){
    console.log(err);
    if (err) {
      res.status(400).send({
        message: err.message
      });
      return;
    }else {
      res.jsonp({ caixa : pagamentos });
    }
  }
};
