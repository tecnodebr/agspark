'use strict';


var path = require('path'),
mongoose = require('mongoose'),
Mensalista = mongoose.model('Mensalista'),
MensalistaVigencias = mongoose.model('MensalistaVigencias'),
MensalistaValor = mongoose.model('MensalistaValor'),
CaixaModel = mongoose.model('Caixa'),
query = require('array-query');

exports.VerificaViradaNovaVigencia = VerificaViradaNovaVigencia;
function VerificaViradaNovaVigencia(mensalista, vigencias) {
  return new Promise(function (resolve, reject) {
    var amanha = new Date(); amanha.setDate(amanha.getDate() + 1); amanha.setHours(0,0,0,0);
    var ontem = new Date(); ontem.setDate(ontem.getDate() -1); ontem.setHours(0,0,0,0);
    var vgCorrente = query.select(vigencias).where('periodovalidade.inicio').lt(amanha).and('periodovalidade.fim').gt(ontem).end();
    Promise.resolve(NovaVigenciaPromisse(vgCorrente)).then(function(result) {
      resolve(result);
    });

    function NovaVigenciaPromisse(vigenciaCorrente){
      return new Promise(function (resolveNovaVigencia, rejectNovaVigencia) {
        var retorno = {};
        retorno.sucesso = true;
        retorno.erros = [];
        retorno.info = [];
        if(vigenciaCorrente == null || vigenciaCorrente == undefined || vigenciaCorrente.length <= 0){
          return Promise.resolve(
            MensalistaVigencias.find({ mensalista : mensalista._id }).sort({ 'periodovalidade.fim' : -1 }).limit(1).exec(function(err, ultimaVigencia) {
              var novaVigencia = new MensalistaVigencias();
              var novaDataInicio = new Date(); novaDataInicio.setHours(0,0,0,0);
              if(ultimaVigencia != null && ultimaVigencia != undefined && ultimaVigencia.length > 0){
                ultimaVigencia = ultimaVigencia[0];
                novaDataInicio.setDate(ultimaVigencia.periodovalidade.fim.getDate() + 1);
                novaDataInicio.setHours(0,0,0,0);
              }
              var novaDataFim = new Date(novaDataInicio); novaDataFim.setMonth(novaDataFim.getMonth() + 1); novaDataFim.setDate(novaDataFim.getDate() -1); novaDataFim.setHours(0,0,0,0);

              novaVigencia.mensalista = mensalista;
              novaVigencia.status = 'aberto';
              novaVigencia.created = new Date();
              novaVigencia.periodovalidade.inicio = novaDataInicio;
              novaVigencia.periodovalidade.fim = novaDataFim;
              novaVigencia.vigencia.ano = novaDataInicio.getUTCFullYear();
              novaVigencia.vigencia.mes = novaDataInicio.getMonth() + 1;
              AtualizaMensalista(novaVigencia).then(function(result){
                resolveNovaVigencia(result);
              });


              function AtualizaMensalista(novaVigenciaSave){
                return new Promise(function (resolveMensalista, rejectMensalista) {
                  MensalistaValor.find({ ativo : true }).sort({ created : -1 }).limit(1).exec(function(err, mensalistaValor) {
                    if(mensalistaValor != null && mensalistaValor != undefined && mensalistaValor.length > 0){
                      mensalistaValor = mensalistaValor[0];
                      novaVigenciaSave.valor = mensalistaValor.valor;
                    }
                    novaVigenciaSave.save(function (err) {
                      if (err) {
                        retorno.sucesso = false;
                        retorno.erros.push({ mensagem : err });
                      }
                      else {
                        retorno.info.push({ mensagem :  'Vigência de mensalista atualizada com sucesso', dado : novaVigencia });
                      }

                      VerificaVigenciaEmAtraso(mensalista, vigencias).then(function(resultAtraso) {
                        resultAtraso.erros.forEach(function(err){
                          retorno.erros.push({ mensagem : err });
                        });
                        resultAtraso.info.forEach(function(info){
                          retorno.info.push({ mensagem : info.mensagem, dado : info.dado });
                        });

                        if(!resultAtraso.atraso){
                          mensalista.status = 'aberto';
                          mensalista.save(function (err) {
                            if (err) {
                              retorno.sucesso = false;
                              retorno.erros.push({ mensagem : err });
                            }
                            else {
                              retorno.info.push({ mensagem :  'Status de mensalista atualizado com sucesso', dado : mensalista });
                            }
                          }).then(function(){
                            resolveMensalista(retorno);
                          });
                        }
                        else {
                          resolveMensalista(retorno);
                        }
                      });
                    });
                  });
                });
              }
            })
          );
        }
        else {
          return retorno;
        }
      });
    }
  });
}

exports.VerificaVigenciaEmAtraso = VerificaVigenciaEmAtraso;
function VerificaVigenciaEmAtraso(mensalista, vigencias){
  var resultado = {};
  resultado.sucesso = true;
  resultado.atraso = false;
  resultado.erros = [];
  resultado.info = [];
  resultado.mensagens = [];

  return new Promise(function (resolve, rejectNova) {
    Promise.resolve(VerificaAtraso(resultado)).then(function(result){
      resolve(result);
    });
  });


  function VerificaAtraso(retorno) {
    var hoje = new Date(); hoje.setHours(0,0,0,0);
    var vigenciasEmAtraso = query.select(vigencias).where('datapagamento').filter(function(dp){ return dp == null || dp == undefined; }).or('periodovalidade.fim').lt(hoje).end();
    vigenciasEmAtraso = query.select(vigenciasEmAtraso).where('status').not().is('pago').end();
    if(vigenciasEmAtraso != null && vigenciasEmAtraso != undefined && vigenciasEmAtraso.length > 0){
      mensalista.status = 'atraso';
      retorno.atraso = true;
      mensalista.save(function (err) {
        if (err) {
          retorno.sucesso = false;
          retorno.mensagens.push({ mensagem : JSON.stringify(err) });
          retorno.erros.push({ mensagem : err });
        }
        else {
          retorno.mensagens.push({ mensagem : 'Status de mensalista atualizado com sucesso', dado : mensalista });
          retorno.atraso = true;
          retorno.info.push({ mensagem : 'Status de mensalista atualizado com sucesso', dado : mensalista });
        }
      });

      vigenciasEmAtraso.forEach(function(vigenAtr){
        vigenAtr.status = 'atraso';
        vigenAtr.save(function (err) {
          if (err) {
            retorno.sucesso = false;
            retorno.mensagens.push({ mensagem : JSON.stringify(err) });
            retorno.erros.push({ mensagem : err });
          }
          else {
            retorno.mensagens.push({ mensagem :  'Vigência de mensalista atualizada com sucesso', dado : vigenAtr });
            retorno.info.push({ mensagem : 'Vigência de mensalista atualizada com sucesso', dado : vigenAtr });
          }
        });
      });
    }
    return retorno;
  }
}


exports.AtualizaStatusMensalistaAposPagamento = AtualizaStatusMensalistaAposPagamento;
function AtualizaStatusMensalistaAposPagamento(mensalista){
  var retorno = {};
  retorno.sucesso = true;
  var hoje = new Date(); hoje.setHours(0,0,0,0);
  var amanha = new Date(); amanha.setDate(amanha.getDate() + 1); amanha.setHours(0,0,0,0);
  var ontem = new Date(); ontem.setDate(ontem.getDate() -1); ontem.setHours(0,0,0,0);
  return new Promise(function (resolve, reject) {
    MensalistaVigencias.find({ mensalista : mensalista._id, $or: [ { status: { $ne : 'pago' } }, { 'periodovalidade.inicio' : { $lt: amanha }, 'periodovalidade.fim' : { $gte: ontem } } ] }).exec(function(err, vigencias) {
      VerificaVigenciaEmAtraso(mensalista, vigencias).then(function(result) {
        if(!(result.atraso)){
          var vigenciasEmAberto = query.select(vigencias).where('status').is('aberto').end();
          if(vigenciasEmAberto != null && vigenciasEmAberto != undefined && vigenciasEmAberto.length > 0){
            mensalista.status = 'aberto';
          }
          else {
            mensalista.status = 'pago';
          }
          mensalista.save(function (err) {
            if (err) {
              retorno.sucesso = false;
              retorno.mensagem = err;
            }
          }).then(function(){ resolve(retorno); });
        }
        else {
          resolve(retorno);
        }
      }).catch(function(err) {
        retorno.sucesso = false;
        retorno.mensagem = err;
        reject(retorno);
      });
    });
  });
}


exports.EfetuarPagamentoMensalistaVigencia = EfetuarPagamentoMensalistaVigencia;
function EfetuarPagamentoMensalistaVigencia(mensalistaVigencia){
  return new Promise(function (resolve, reject) {
    CaixaModel.find({ mensalistavigencias : { $in: [mensalistaVigencia._id] } }).populate('mensalistavigencias').exec(function (err, pagamentosVigencia) {
      if(err){
        reject(err);
      }
      var valorPago = 0;
      var valorDevido = mensalistaVigencia.valor;
      pagamentosVigencia.forEach(function(pagamento){
        valorPago += pagamento.valor;
        pagamento.mensalistavigencias.forEach(function(vigencia){
          if(vigencia._id.toString() != mensalistaVigencia._id.toString()) {
            valorDevido += vigencia.valor;
          }
        });
      });

      if(valorPago >= valorDevido){
        mensalistaVigencia.status = 'pago';
        mensalistaVigencia.datapagamento = new Date();
        mensalistaVigencia.save(function(err) {
          if (err) {
            reject(err);
          } else {
            Mensalista.findById(mensalistaVigencia.mensalista).exec(function(err, mensalista) {
              if(err){
                reject(err);
              }

              AtualizaStatusMensalistaAposPagamento(mensalista).then(function(result) {

                if(result.sucesso)
                  return resolve(mensalistaVigencia);
                else {
                  reject(result.mensagem);
                }
              }).catch(function(err) {
                console.log(err);
                reject(err);
              });
            });
          }
        });
      }
      else{
        reject('Valor de entrada em caixa insuficiente para pagamento da mensalidade');
      }
    });
  });
}


exports.RecalculaValorVigenciaParcial = RecalculaValorVigenciaParcial;
function RecalculaValorVigenciaParcial(mensalistaVigencia) {
  return new Promise(function (resolve, reject) {
    var qtdDiasUtilizados = Math.round((mensalistaVigencia.periodovalidade.fim - mensalistaVigencia.periodovalidade.inicio)/(1000*60*60*24)) + 1;
    var dataFinalOriginal = new Date(mensalistaVigencia.periodovalidade.inicio);
    dataFinalOriginal.setMonth(dataFinalOriginal.getMonth() +1);
    dataFinalOriginal.setDate(dataFinalOriginal.getDate() -1);
    var qtdDiasMes = Math.round((dataFinalOriginal - mensalistaVigencia.periodovalidade.inicio)/(1000*60*60*24)) + 1;
    var valorParcial = parseFloat(parseFloat(((mensalistaVigencia.valor / qtdDiasMes) * qtdDiasUtilizados)).toFixed(2));
    mensalistaVigencia.valor = valorParcial;
    resolve(mensalistaVigencia);
  });

}
