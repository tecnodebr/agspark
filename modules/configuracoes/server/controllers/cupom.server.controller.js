'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  Empresa = mongoose.model('Empresa'),
  Entradaveiculo = mongoose.model('Entradaveiculo');

var SerialPort = require('serialport').SerialPort;
var serialPort = new SerialPort('/dev/ttyUSB0', { baudrate: 57600 }, false);
var Printer = require('thermalprinter');


exports.entradaveiculo = function (req, res) {
  Entradaveiculo.findById(req.params.entradaveiculoId).exec(function (err, entradaveiculo) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    } else if (!entradaveiculo) {
      return res.status(404).send({
        message: 'Entrada não registrada!'
      });
    }
    exports.printEntradaVeiculo(entradaveiculo, function(sucesso){ if(sucesso) res.jsonp(entradaveiculo); else res.json({ message : 'Erro' }); });
  });
};


exports.printEntradaVeiculo = function(entradaveiculo, callback){
  Empresa.findOne().limit(1).exec(function (err, empresa) {
    var retorno = true;
    if (err) {
      retorno = false;
    } else if (!empresa) {
      retorno = false;
    }

    var printer = new Printer(serialPort, { commandDelay: 100 });
    serialPort.open(function (err) {
      if (err) {
        retorno = false;
      }

      printer.cutPaper = function() {
      	var commands = [27, 109];
      	return this.writeCommands(commands);
      };

      printer
      .indent(10)
      .bold(false)
      .small(true)
      .center()
      .printLine(empresa ? (empresa.nome + ' CNPJ:' + empresa.cnpj + ' Fone: ' + empresa.telefone) : '')
      .printLine(empresa ? (empresa.endereco.logradouro + ' N ' + empresa.endereco.numero + ' - ' + empresa.endereco.uf) : '')
      .printLine(empresa ? (empresa.horariofuncionamento) : '')
      .small(false)
      .horizontalLine(100)
      .printLine('ENTRADA: ' + entradaveiculo.created.toString('dd/MM/yyyy HH:mm:ss'))
      .bold(true)
      .printLine('Prisma: ' + entradaveiculo.numeroPrisma)
      .left()
      .bold(false)
      .printLine('NAO NOS RESPONSABILIZAMOS POR OBJETOS E VALORES DEIXADOS NO VEICULO, NEM POR QUEBRAS MECANICAS OU ELETRICAS')
      .big(true)
      .printLine('Placa: ' + entradaveiculo.placaLetras + '-' + entradaveiculo.placaNumeros.toString())
      .big(false)
      .bold(true)
      .printLine((entradaveiculo.veiculo.marcaModelo) + ' - ' + (entradaveiculo.corVeiculo))
      .bold(false)
      .center()
      .horizontalLine(100)
      .barcodeTextPosition(2)
      .barcodeHeight(100)
      .barcode(Printer.BARCODE_TYPES.EAN13, '000000000000'.substring(0, 12 - entradaveiculo._idEntradaveiculo.toString().length) + entradaveiculo._idEntradaveiculo.toString())
      .cutPaper()
      .print(function() {
        serialPort.close(function (err) { retorno = true; });
      });
    });
    if(callback)
      callback(retorno);
  });
};

exports.printFechamentoCaixa = function(fechamentoCaixa, callback){


  var Caixa = mongoose.model('Caixa');
  //Encontra o registro de abertura do caixa.
  Caixa.findById(fechamentoCaixa.registroDeAbertura).exec(function(err, registroAbertura){

    // Lista todos os movimentos do respectivo caixa
    Caixa.find({ registroDeAbertura:fechamentoCaixa.registroDeAbertura }).sort('-created').exec(function (err, movimentos){

    });
    
  });



  Empresa.findOne().limit(1).exec(function (err, empresa) {
    var retorno = true;
    if (err) {
      retorno = false;
    } else if (!empresa) {
      retorno = false;
    }

    var printer = new Printer(serialPort, { commandDelay: 100 });
    serialPort.open(function (err) {
      if (err) {
        retorno = false;
      }

      printer.cutPaper = function() {
      	var commands = [27, 109];
      	return this.writeCommands(commands);
      };

      // printer
      // .indent(10)
      // .bold(false)
      // .small(true)
      // .center()
      // .printLine(empresa ? (empresa.nome + ' CNPJ:' + empresa.cnpj + ' Fone: ' + empresa.telefone) : '')
      // .printLine(empresa ? (empresa.endereco.logradouro + ' N ' + empresa.endereco.numero + ' - ' + empresa.endereco.uf) : '')
      // .printLine(empresa ? (empresa.horariofuncionamento) : '')
      // .small(false)
      // .horizontalLine(100)
      // .printLine('ENTRADA: ' + entradaveiculo.created.toString('dd/MM/yyyy HH:mm:ss'))
      // .bold(true)
      // .printLine('Prisma: ' + entradaveiculo.numeroPrisma ? entradaveiculo.numeroPrisma : '')
      // .left()
      // .bold(false)
      // .printLine('NAO NOS RESPONSABILIZAMOS POR OBJETOS E VALORES DEIXADOS NO VEICULO, NEM POR QUEBRAS MECANICAS OU ELETRICAS')
      // .big(true)
      // .printLine('Placa: ' + entradaveiculo.placaLetras + '-' + entradaveiculo.placaNumeros.toString())
      // .big(false)
      // .bold(true)
      // .printLine((entradaveiculo.veiculo ? entradaveiculo.veiculo.marcaModelo : '') + ' - ' + (entradaveiculo.corVeiculo ? entradaveiculo.corVeiculo : ''))
      // .bold(false)
      // .center()
      // .horizontalLine(100)
      // .barcodeTextPosition(2)
      // .barcodeHeight(100)
      // .barcode(Printer.BARCODE_TYPES.EAN13, '000000000000'.substring(0, 12 - entradaveiculo._idEntradaveiculo.toString().length) + entradaveiculo._idEntradaveiculo.toString())
      // .cutPaper()
      // .print(function() {
      //   serialPort.close(function (err) { retorno = true; });
      // });
    });
    if(callback)
      callback(retorno);
  });
};
exports.cupomByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cupom não encontrado'
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
