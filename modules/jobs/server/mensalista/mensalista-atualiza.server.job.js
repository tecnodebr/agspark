'use strict';

var schedule = require('node-schedule'),
    mongoose = require('mongoose'),
    path = require('path'),
    Mensalista = mongoose.model('Mensalista'),
    MensalistaVigencias = mongoose.model('MensalistaVigencias'),
    mensalistaBusiness = require(path.resolve('./modules/mensalista/server/business/mensalista.server.business.js')),
    query = require('array-query');

exports.job = {};

exports.start = function() {
  global.logger.info('[JOB]', { mensagem : 'iniciando job atualiza mensalista...' });
  exports.job = schedule.scheduleJob({ second : 10 }, function(){
    global.logger.info('[JOB]', { mensagem : 'Início de execução do job atualiza mensalista...' });
    Mensalista.find({ status : { $ne : 'cancelado' } }).sort('-created').populate('user', 'displayName').exec(function(err, listaMensalista) {
      if (err) {
        global.logger.error('[JOB]', { mensagem : err });
      }
      else {
        var hoje = new Date(); hoje.setHours(0,0,0,0);
        listaMensalista.forEach(function(mensalista){
          var amanha = new Date(); amanha.setDate(amanha.getDate() + 1); amanha.setHours(0,0,0,0);
          var ontem = new Date(); ontem.setDate(ontem.getDate() -1); ontem.setHours(0,0,0,0);
          MensalistaVigencias.find({ mensalista : mensalista._id, $or: [ { status: { $ne : 'pago' } }, { 'periodovalidade.inicio' : { $lt: amanha }, 'periodovalidade.fim' : { $gte: ontem } } ] }).exec(function(err, vigencias) {
            if(err){
              global.logger.error('[JOB]', { mensagem : err });
            }
            else {
              mensalistaBusiness.VerificaViradaNovaVigencia(mensalista, vigencias).then(function(retorno){
                if(retorno.erros){
                  retorno.erros.forEach(function(err){
                    global.logger.error('[JOB]', { mensagem : JSON.stringify(err.mensagem) });
                  });
                }
                if(retorno.info){
                  retorno.info.forEach(function(inf){
                    global.logger.info('[JOB]', { mensagem : inf.mensagem, dado : JSON.stringify(inf.dado) });
                  });
                }
              }).catch(function(retorno){
                if(retorno.erros){
                  retorno.erros.forEach(function(err){
                    global.logger.error('[JOB]', { mensagem : JSON.stringify(err.mensagem) });
                  });
                }
              });
            }
          });
        });
        global.logger.info('[JOB]', { mensagem : 'Termino de execução do job atualiza mensalista...' });
      }
    });
  });
};

exports.stop = function() {
  exports.job.cancel();
};
