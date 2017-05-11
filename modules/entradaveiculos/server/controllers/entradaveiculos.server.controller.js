'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
Entradaveiculo = mongoose.model('Entradaveiculo'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
_ = require('lodash'),
datejs = require('datejs'),

Camelot = require(path.resolve('./modules/entradaveiculos/server/controllers/camelot/camelot.js')),
uuid = require('node-uuid');
var fs = require('fs');
var TimerHelper = require('./timer.helper');
var Mensalista = mongoose.model('Mensalista');
var MensalistaVigencias = mongoose.model('MensalistaVigencias');
var cupom = require(path.resolve('./modules/configuracoes/server/controllers/cupom.server.controller'));
var query = require('array-query');
var CaixaService = require(path.resolve('./modules/caixas/server/controllers/caixa.service'));
//var CaixaControler = require(path.resolve('./modules/caixas/server/controllers/caixas.server.controller.js'));
var CaixaModel = mongoose.model('Caixa');
var mime = require('mime');
var domain = require('domain');
var d = domain.create();

/**
* Create a Entradaveiculo
Verificar se a placa já está no pátio, se estiver não deixar dar entrada.

*/
exports.create = function(req, res) {
  var entradaveiculo = new Entradaveiculo(req.body);
  entradaveiculo.user = req.user;

  entradaveiculo.placaLetras = entradaveiculo.placaLetras.toUpperCase();
  Entradaveiculo.find({
    placaLetras: entradaveiculo.placaLetras,
    placaNumeros: entradaveiculo.placaNumeros,
    dataSaida: null
  }).exec(validaCarroNoPatio);

  function validaCarroNoPatio(err, veiculoPatio) {
    if (err) {
      console.log('ERRO1');
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (veiculoPatio.length > 0) {
      console.log('ERRO2');
      return res.status(400).send({
        message: 'O veículo digitado já se encontra no pátio.'
      });
    }

    d.on('error', (er) => {
      global.logger.error('Captura de Foto', { mensagem : JSON.stringify(er) });
    });

    d.run(() => {
      entradaveiculo.save(function(err) {
        if (err) {
          console.log('ERRO3');
          return res.status(400).send({
            message: err
          });
        } else {
          console.log('Fim do registro de entrada, retorno do post.');
          cupom.printEntradaVeiculo(entradaveiculo);
          entradaveiculo.device = '/dev/video0';
          tirarFoto(entradaveiculo, callbackTiraFoto);
          res.jsonp(entradaveiculo);
        }
      });

      function callbackTiraFoto(errofoto, entradaveiculo) {
        if (errofoto) {
          console.log('ERRO1:' + JSON.stringify(errofoto));
        }

        if (entradaveiculo.image) {
          entradaveiculo.fotosEntrada = [];
          var foto ={};
          foto.data = entradaveiculo.image;
          foto.contentType = mime.lookup('png');
          entradaveiculo.fotosEntrada.push(foto);
          entradaveiculo.save(function(err) {
            if (err) {
              global.logger.error('Erro ao tentar salvar imagem na base de dados.' + JSON.stringify(err));
            }
          });
        }
      }
    });
  }


};

function tirarFoto(fotoParams, callback){
  var _options = {
    verbose: true,
    device : fotoParams.device, //'/dev/video0',
    resolution : '640x480',
    png : '1',
    greyscale : false,
    title : 'Entrada 1',
    font : 'Arial:12',
    controls : {
      focus : '20',
      brightness : 40,
      contrast : 100,
      saturation : 80,
      hue : 0,
      gamma : 500,
      sharpness : 50
    }
  };

  var camelot = new Camelot(_options);

  camelot.on('frame', function (image) {
    console.log('Chamou o camelot frame');
    console.log('frame received!');
    fotoParams.image = image;
    callback(null, fotoParams);
  });

  camelot.on('error', function (error) {
    console.log('Entradaveiculo controller camelot callback', error);
    callback(error, null);
  });

  camelot.grab(_options, function(err, fileName){
    if (err) {
      global.logger.error('Erro ao tentar capturar imagem', err);
      console.log('Erro ao tentar capturar imagem', err);
      callback(err, null);
    }else {
      console.log('Sucesso no grab.');
      //callback(null, fileName);
    }
  });
}

/**
* Show the current Entradaveiculo
*/
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var entradaveiculo = req.entradaveiculo ? req.entradaveiculo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  entradaveiculo.isCurrentUserOwner = req.user && entradaveiculo.user && entradaveiculo.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(entradaveiculo);
};


function ListHorariosPermanencia(entradaveiculo, sucessoCallback, errorCallback)
{
  Mensalista.findOne(
    {
      'carros':
      {
        $elemMatch: { 'placaLetras': entradaveiculo.placaLetras, 'placaNumeros': entradaveiculo.placaNumeros }
      }
    }).populate('carros.diasDaSemana').populate('user', 'displayName').exec(function (err, mensalista) {
      if(err){
        if(errorCallback){
          errorCallback(err);
        }
        else {
          throw new Error(400, err);
        }
      }

      var oneDay = 24*60*60*1000;
      var diffDays = Math.round(Math.abs((entradaveiculo.created.getTime() - new Date().getTime())/(oneDay)));
      var diasPermanecia = [];

      for(var i = 0; i <= diffDays; i++){
        var entradaDia = new Date(new Date(entradaveiculo.created).setDate(new Date(entradaveiculo.created).getDate() + i));
        var Ini = new Date();
        var Fim = new Date();
        if(i == 0){
          Ini = entradaDia;
        }
        else {
          var dayIni = entradaDia.getUTCDate();
          var monthIni = entradaDia.getUTCMonth() + 1;
          var yearIni = entradaDia.getUTCFullYear();
          Ini = new Date(yearIni, monthIni, dayIni, 0, 0, 0);
        }

        if(i == diffDays){
          Fim = new Date();
        }
        else {
          var dayFim = entradaDia.getUTCDate();
          var monthFim = entradaDia.getUTCMonth() + 1;
          var yearFim = entradaDia.getUTCFullYear();
          Fim = new Date(yearFim, monthFim, dayFim, 23, 59, 59);
        }
        diasPermanecia.push({ Inicio : Ini, Fim : Fim });
      }

      var horarios = [];

      if(mensalista != null && mensalista != undefined) {
        var carro = query.select(mensalista.carros).where('placaLetras').is(entradaveiculo.placaLetras).and('placaNumeros').is(entradaveiculo.placaNumeros).limit(1).end();
        if(carro != null && carro != undefined){
          carro = carro[0];
          var DiaHorarioPermanenciaObter = [];
          diasPermanecia.forEach(function(entradaveiculoDia){
            var diaEntrada = new Date(entradaveiculoDia.Inicio); diaEntrada.setHours(0,0,0,0);
            DiaHorarioPermanenciaObter.push(
              new Promise(function (resolve, reject) {
                MensalistaVigencias.findOne({ mensalista : mensalista,  'periodovalidade.inicio' : { $lte: diaEntrada }, 'periodovalidade.fim' : { $gte: diaEntrada } } ).exec(function (err, vigenciaAtual) {
                  if(vigenciaAtual == null || vigenciaAtual == undefined){
                    var pEntrada = ((entradaveiculoDia.Inicio.getHours() * 60) + entradaveiculoDia.Inicio.getMinutes());
                    var pFinalDia = ((entradaveiculoDia.Fim.getHours() * 60) + entradaveiculoDia.Fim.getMinutes());
                    var day = entradaveiculoDia.Inicio.getUTCDate();
                    var month = entradaveiculoDia.Inicio.getUTCMonth() + 1;
                    var year = entradaveiculoDia.Inicio.getUTCFullYear();
                    var diaPermanencia = new Date(year, month, day, 0, 0, 0);
                    horarios.push({ Data : diaPermanencia, Inicio : pEntrada, Fim : pFinalDia, Minutos : pFinalDia - pEntrada, IsMensalista : false, Valor : '-' });
                  }
                  else {
                    var dweek = (entradaveiculoDia.Inicio.getDay() +1);
                    var diaSemana = query.select(carro.diasDaSemana).where('codigo').is(dweek).end();
                    diaSemana.forEach(function(d){
                      var pIni = ((new Date(d.horarioInicial).getHours() * 60) + new Date(d.horarioInicial).getMinutes());
                      var pFim = ((new Date(d.horarioFinal).getHours() * 60) + new Date(d.horarioFinal).getMinutes());

                      var pEntrada = ((entradaveiculoDia.Inicio.getHours() * 60) + entradaveiculoDia.Inicio.getMinutes());
                      var pFinalDia = ((entradaveiculoDia.Fim.getHours() * 60) + entradaveiculoDia.Fim.getMinutes());

                      var day = entradaveiculoDia.Inicio.getUTCDate();
                      var month = entradaveiculoDia.Inicio.getUTCMonth() + 1;
                      var year = entradaveiculoDia.Inicio.getUTCFullYear();
                      var diaPermanencia = new Date(year, month, day, 0, 0, 0);
                      if(pEntrada < pIni) {
                        if(pFinalDia < pIni)
                        horarios.push({ Data : diaPermanencia, Inicio : pEntrada, Fim : pFinalDia, Minutos : pFinalDia - pEntrada, IsMensalista : false, Valor : '-' });
                        else {
                          if(pFinalDia <= pFim){
                            horarios.push({ Data : diaPermanencia, Inicio : pEntrada, Fim : pIni -1, Minutos : pIni -1 - pEntrada , IsMensalista : false, Valor : '-' });
                            horarios.push({ Inicio : pIni, Fim : pFinalDia, Minutos : pFinalDia - pIni, IsMensalista : true, Valor : '-' });
                          }
                          else {
                            horarios.push({ Data : diaPermanencia, Inicio : pEntrada, Fim : pIni -1, Minutos : pIni -1 - pEntrada, IsMensalista : false, Valor : '-' });
                            horarios.push({ Data : diaPermanencia, Inicio : pIni, Fim : pFim, Minutos : pFim - pIni, IsMensalista : true, Valor : '-' });
                            horarios.push({ Data : diaPermanencia, Inicio : pFim +1, Fim : pFinalDia, Minutos : pFinalDia - pFim + 1, IsMensalista : false, Valor : '-' });
                          }
                        }
                      }
                      else {
                        if(pEntrada <= pFim){
                          if(pFinalDia <= pFim)
                          horarios.push({ Data : diaPermanencia, Inicio : pEntrada, Fim : pFinalDia, Minutos : pFinalDia - pEntrada, IsMensalista : true, Valor : '-' });
                          else {
                            horarios.push({ Data : diaPermanencia, Inicio : pEntrada, Fim : pFim, Minutos : pFim - pEntrada, IsMensalista : true, Valor : '-' });
                            horarios.push({ Data : diaPermanencia, Inicio : pFim +1, Fim : pFinalDia, Minutos : pFinalDia - pFim +1, IsMensalista : false, Valor : '-' });
                          }
                        }
                        else {
                          horarios.push({ Data : diaPermanencia, Inicio : pEntrada, Fim : pFinalDia, Minutos : pFinalDia - pEntrada, IsMensalista : false, Valor : '-' });
                        }
                      }
                    });
                  }
                  resolve(horarios);
                });
              }
            ));
          });
          Promise.all(DiaHorarioPermanenciaObter).then(function(resposta){
            if(sucessoCallback){
              sucessoCallback({ horarios : horarios });
            }
            else {
              return { horarios : horarios };
            }
          });
        }
      }
      else {
        diasPermanecia.forEach(function(entradaveiculoDia){

          var pEntrada = ((entradaveiculoDia.Inicio.getHours() * 60) + entradaveiculoDia.Inicio.getMinutes());
          var pFinalDia = ((entradaveiculoDia.Fim.getHours() * 60) + entradaveiculoDia.Fim.getMinutes());

          var day = entradaveiculoDia.Inicio.getUTCDate();
          var month = entradaveiculoDia.Inicio.getUTCMonth() + 1;
          var year = entradaveiculoDia.Inicio.getUTCFullYear();
          var diaPermanencia = new Date(year, month, day, 0, 0, 0);
          horarios.push({ Data : diaPermanencia, Inicio : pEntrada, Fim : pFinalDia, Minutos : pFinalDia - pEntrada, IsMensalista : false });
        });
        if(sucessoCallback)
        sucessoCallback({ horarios : horarios });
        else {
          return { horarios : horarios };
        }
      }
    });
  }


  /**
  * Monta tabela de dia/horario de permanencia e separa avulso/mensalista
  */
  exports.horariospermanencia = function(req, res) {
    // convert mongoose document to JSON
    var entradaveiculo = req.entradaveiculo ? req.entradaveiculo.toJSON() : {};

    ListHorariosPermanencia(entradaveiculo, sucessoCallback, errorCallback);

    function errorCallback(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    function sucessoCallback(horarios) {
      res.jsonp(horarios);
    }
  };


  /**
  * Calcula o valor a ser cobrado para saída
  */
  exports.calcularsaida = function(req, res) {
    var entradaveiculo = req.entradaveiculo ? req.entradaveiculo.toJSON() : {};
    var tabelaPreco = req.tabelapreco ? req.tabelapreco.toJSON() : {};

    if(tabelaPreco == null || tabelaPreco == undefined){
      return res.status(400).send({
        message: 'Tabela de preços não selecionada ou inválida!'
      });
    }
    else if(!tabelaPreco.ativo){
      return res.status(400).send({
        message: 'Tabela de preços inativa!'
      });
    }


    ListHorariosPermanencia(entradaveiculo, sucessoCallback, errorCallback);

    function errorCallback(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    function sucessoCallback(resp) {
      resp.horarios.forEach(function(h){
        if(h.IsMensalista)
        h.Valor = 0;
        else {
          var preco = query.select(tabelaPreco.precos).where('tempoInicial').lt(h.Minutos -1).and('tempoFinal').gt(h.Minutos -1).limit(1).end();
          if(preco != null && preco != undefined && preco.length> 0)
          h.Valor = preco[0].valorTempoNormal;
          else {
            preco = query.select(tabelaPreco.precos).where('tempoFinal').lt(h.Minutos -1).sort('tempoFinal').numeric().desc().limit(1).end();
            if (preco != null && preco != undefined && preco.length> 0) {
              var valorCalculadoFaixa = preco[0].valorTempoNormal;
              var tempoExcedente = h.Minutos - preco[0].tempoFinal;
              var tempoExcedente2 = 0;
              if (tempoExcedente > 0) {
                tempoExcedente2 = tempoExcedente / preco[0].tempoAdicional;
                var arredondamentoPraCima = Math.ceil(tempoExcedente2);
                var valorAdicional = arredondamentoPraCima * preco[0].valorTempoAdicional;
                h.Valor = valorCalculadoFaixa + valorAdicional;
              }
            }
          }
        }
      });
      return res.jsonp(resp);
    }
  };

  /**
  * Update a Entradaveiculo
  */
  exports.update = function(req, res) {
    console.log('Atualizando entrada...');
    var entradaveiculo = req.entradaveiculo ;
    console.log(entradaveiculo);
    entradaveiculo = _.extend(entradaveiculo , req.body);
    if(!entradaveiculo.dataSaida)
    {
      console.log(JSON.stringify(entradaveiculo));
      entradaveiculo.dataSaida = Date.now();
    }


    var pagamentos = [];

    for (var i = 0; i < entradaveiculo.dynamicProperties.pagamentos.length; i++) {
      var caixaModel = new CaixaModel();
      caixaModel.valor = entradaveiculo.dynamicProperties.pagamentos[i].Valor;
      caixaModel.entradaveiculo = entradaveiculo;
      caixaModel.formaDePagamento = entradaveiculo.dynamicProperties.pagamentos[i].FormaPagamento.toUpperCase();
      if (caixaModel.formaDePagamento === 'CARTAO') {
        caixaModel.formaDePagamento = 'CARTAOCREDITO';
      }
      caixaModel.tipoEntrada = 'ENTRADA';
      caixaModel.user = req.user;
      pagamentos.push(caixaModel);
    }

    CaixaService.registraArray(pagamentos, callbackRegistra);

    function callbackRegistra(err, caixa){
      if (err) {
        return res.status(400).send({
          message: JSON.stringify(err)
        });
      }else {
        entradaveiculo.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(entradaveiculo);
          }
        });
      }
    }
  };

  /**
  * Delete an Entradaveiculo
  */
  exports.delete = function(req, res) {
    var entradaveiculo = req.entradaveiculo ;

    entradaveiculo.remove(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(entradaveiculo);
      }
    });
  };

  /**
  * List of Entradaveiculos
  */
  exports.list = function(req, res) {
    Entradaveiculo.find(
      {'dataSaida':null},
      {'fotosEntrada':0}
    ).sort('-created').populate('user').exec(function(err, entradaveiculos) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        for (var i = 0; i < entradaveiculos.length; i++) {
          entradaveiculos[i].dynamicProperties = {
            tempoPercorridoEmMS : Date.parse(entradaveiculos[i].created).getElapsed(),
            placa: entradaveiculos[i].placaLetras + '-' + entradaveiculos[i].placaNumeros
          };
          entradaveiculos[i].dynamicProperties.tempoPorExtenso = TimerHelper.msToTime(entradaveiculos[i].dynamicProperties.tempoPercorridoEmMS) ;
        }
        res.jsonp(entradaveiculos);
      }
    });
  };


  /**
  * Entradaveiculo middleware
  */
  exports.entradaveiculoByID = function(req, res, next, id) {
    Array.prototype.myFind = function(obj) {
      return this.filter(function(item) {
        for (var prop in obj)
        if (!(prop in item) || obj[prop] !== item[prop])
        return false;
        return true;
      });
    };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Entradaveiculo is invalid'
      });
    }

    var Tabelapreco = mongoose.model('Tabelapreco');

    Entradaveiculo.findById(id, { 'fotosEntrada':0 }).populate('user', 'displayName').exec(function (err, entradaveiculo) {
      if (err) {
        return next(err);
      } else if (!entradaveiculo) {
        return res.status(404).send({
          message: 'Entrada não encontrada.'
        });
      }

      Tabelapreco.find({ ativo:true }).populate('precos').exec(function(err, tabelaprecos) {
        if (err) {
          global.logger.error('Erro ao recuperar tabelas de preço err:%s', err);
          return res.status(404).send({
            message: 'Erro ao recuperar tabelas de preço.'
          });
        } else {
          if (!entradaveiculo.dynamicProperties) {
            entradaveiculo.dynamicProperties = {};
          }

          entradaveiculo.dynamicProperties.tempoEstadiaEmMS = Date.parse(entradaveiculo.created).getElapsed();
          entradaveiculo.dynamicProperties.tempoEstadiaEmMinutos = TimerHelper.msToMinutes(entradaveiculo.dynamicProperties.tempoEstadiaEmMS);
          entradaveiculo.dynamicProperties.tempoPorExtenso = TimerHelper.msToTime(entradaveiculo.dynamicProperties.tempoEstadiaEmMS);

          if (entradaveiculo.fotosEntrada) {
            entradaveiculo.dynamicProperties.fotosEntrada =[];
            for (var i = 0; i < entradaveiculo.fotosEntrada.length; i++) {
              if(entradaveiculo.fotosEntrada[i].data != null && entradaveiculo.fotosEntrada[i].data != '')
              {
                var foto = { data:null, contentType:null };
                foto.data = new Buffer(entradaveiculo.fotosEntrada[i].data).toString('base64');
                foto.contentType = entradaveiculo.fotosEntrada[i].contentType;
                entradaveiculo.dynamicProperties.fotosEntrada.push(foto);
              }
            }
          }


          if (tabelaprecos) {
            var hoje = new Date();
            var diaSemana = hoje.getDay()+1;
            var tabelasValidas = [];
            for (var j = 0; j < tabelaprecos.length; j++) {
              var diaOk = tabelaprecos[j].diasDaSemana.myFind({ codigo:diaSemana, selecionado:true });
              if (diaOk.length > 0) {
                tabelasValidas.push(tabelaprecos[j]);
                continue;
              }
            }
            //  tabelaprecos.find();

            entradaveiculo.dynamicProperties.tabelasPreco = tabelasValidas;
          }

          if (entradaveiculo.fotoEntrada) {
            entradaveiculo.fotoEntrada = entradaveiculo.fotoEntrada.replace('./public/', '');
          }


          req.entradaveiculo = entradaveiculo;
          next();
        }
      });
    });
  };
