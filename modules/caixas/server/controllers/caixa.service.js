'use strict';
var mongoose = require('mongoose');
var Caixa = mongoose.model('Caixa');

exports.registraArray = registraArray;

function registraArray(collection, callback) {
  var coll = collection.slice(0); // clone collection
  console.log('Inserindo registros no caixa...');
  (function insertOne() {
    var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
    try {
      registra(record, function(err, caixa) {

        if (err) {
          console.log('Erro no insert array: ' + JSON.stringify(err));
          callback(err);
          return;
        }

        if (coll.length == 0) {
          console.log('Inseriu todos :): ');
          callback();
        } else {
          insertOne();
        }
      });
    } catch (exception) {
      callback(exception);
    }
  })();
}

exports.registra = registra;

function registra(caixa, callback){
  if (!callback) {
    throw 'Callback não informado!';
  }

  if (caixa.valor === 0 && caixa.tipoEntrada !== 'FECHAMENTO') {
    callback('Erro, valor não informado!');
    return;
  }

  if (caixa.tipoEntrada !== 'ABERTURA') {
    // Procura um caixa aberto para o usuário
    Caixa.find({ tipoEntrada:'ABERTURA', user: caixa.user }).sort({ created:-1 }).limit(1).exec(function(err, caixaAbertura) {
      if (err) {
        console.log('erro1');
        callback({
          message: err
        });
      } else {
        if (caixaAbertura.length === 0) {
          callback({ message:'Erro, não existe caixa aberto, favor efetuar abertura.' });
        }else {
          // Verifica se o caixa não foi fechado ainda, se foi dá erro.
          Caixa.findOne({ tipoEntrada:'FECHAMENTO', registroDeAbertura: caixaAbertura[0] }).exec(function(err, caixaFechado){
            if (err) {
              console.log('erro2');
              callback({
                message: err
              });
            } else {
              if (caixaFechado) {
                callback({
                  message: 'Erro (caixa fechado), não foi encontrado um caixa aberto, favor efetuar abertura do caixa.'
                });
              } else {
                caixa.registroDeAbertura = caixaAbertura[0];
                caixa.save(function(err) {
                  if (err) {
                    console.log('erro3');
                    callback({
                      message: err
                    });
                  } else {
                    callback(null, caixa);
                  }
                });
              }
            }
          });
        }
      }
    });
  } else {
    console.log('Tentando abrir caixa...:' + JSON.stringify(caixa));
    // Procura um caixa aberto para o usuário
    Caixa.find({ tipoEntrada:'ABERTURA', user: caixa.user }).sort({ created:-1 }).limit(1).exec(function(err, caixaAbertura) {
      if (err) {
        callback({
          message: err
        });
      } else {
        if (caixaAbertura.length == 0) {
          caixa.save(function(err) {
            if (err) {
              console.log('erro4');
              callback({
                message: err
              });
            } else {
              console.log('Gravou abertura:' + JSON.stringify(caixa));
              callback(null, caixa);
            }
          });
        } else {
          // Verifica se o caixa não foi fechado ainda, se ele ainda estiver aberto não deixa abrir um novo.
          Caixa.findOne({ tipoEntrada:'FECHAMENTO', registroDeAbertura: caixaAbertura[0] }).exec(function(err, caixaFechado){
            if (err) {
              console.log('erro5');
              callback({
                message: err
              });
            } else {
              if (!caixaFechado) {
                callback({
                  message: 'Já existe um caixa aberto!'
                });
              } else {
                caixa.save(function(err) {
                  if (err) {
                    callback({
                      message: err
                    });
                  } else {
                    console.log('Gravou abertura:' + JSON.stringify(caixa));
                    callback(null, caixa);
                  }
                });
              }
            }
          });
        }
      }
    });
  }
}
