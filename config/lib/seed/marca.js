'use strict';

var mongoose = require('mongoose');
var path = require('path');
var request = require('request');
var http = require('http');
var removeDiacritics = require('diacritics').remove;
var fs = require('fs');

function wrFile(filename, content) {
  var fs = require('fs');
  fs.writeFile(filename, content, function (err) {
    if (err) {
      return console.log(err);
    }
    //console.log('The file was saved:' + filename);
    //console.log(content);
  });
}

function saveMarca(m, callback) {
  //console.log('Chegou pra salvar a marca: ' + JSON.stringify(m));
  var Marca = mongoose.model('Marca');
  Marca.findOne({ nome:m.N, categoriaVeiculo:m.categoriaVeiculo }).exec(function (errMarcaCadastrada, marcaCadastrada) {
    if (errMarcaCadastrada) {
      global.logger.error(errMarcaCadastrada);
      callback('Erro ao buscar marca: ' + errMarcaCadastrada);
    } else if (!marcaCadastrada) {
      var marca = new Marca();
      marca.nome = m.N;
      marca.categoriaVeiculo = m.categoriaVeiculo;
      marca.save(function(err) {
        if (err) {
          global.logger.error('Erro ao salvar a marca importada: ' + err);
          callback('Erro ao salvar a marca importada: ' + err);
        } else {
          //console.log('Marca salva: '+ marca.nome);
          callback(null, marca);
        }
      });
    }else {
      //console.log('Marca já existe: ' + marcaCadastrada.nome);
      callback(null, marcaCadastrada);
    }
  });
}

function saveModelo(m, callback) {
  //console.log('Chegou pra salvar o modelo: ' + JSON.stringify(m));
  var Modelo = mongoose.model('Modelo');
  Modelo.findOne({ nome:m.nome, marca:m.marca}).populate('marca').exec(function (errModeloCadastrada, modeloCadastrada) {
    if (errModeloCadastrada) {
      global.logger.error(errModeloCadastrada);
      callback('Erro ao buscar modelo: ' + errModeloCadastrada);
    } else if (!modeloCadastrada) {
      var modelo = new Modelo();
      modelo.nome = m.nome;
      modelo.marca = m.marca;
      modelo.save(function(err) {
        if (err) {
          global.logger.error('Erro ao salvar a modelo: ' + err);
          callback('Erro ao salvar a modelo: ' + err);
        } else {
          //console.log('Modelo salvo: '+ modelo.nome);
          callback(null, modelo);
        }
      });
    }else {
      //console.log('Modelo já existe: ' + modeloCadastrada.nome);
      callback('Modelo já existe:' + modeloCadastrada.marca.nome + '-' + modeloCadastrada.nome);
    }
  });
}

function getMarcasFromWeb(url, callback){
  request(url.urlMarcas, function (err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) return callback(res.statusCode);
    //console.log(body);
    var marcas = JSON.parse(body);
    marcas.urlModelo = url.urlModelo;
    callback(null, marcas);
  });
}

function seedMarca(){
  var configCarro = {
    urlMarcas: 'http://www.webmotors.com.br/carro/marcasativas?tipoAnuncio=novos-usados',
    urlModelo: 'http://www.webmotors.com.br/carro/modelosativos?marca=',
    caminhoAqruivos: './seed_data/carros/marcas/modelos/',
    categoriaVeiculo: 'CARRO'
  };
  getMarcasFromWeb(configCarro, function(err, marcas){
    if (err) {
      global.logger.error(err);
      var marcasFile = require(path.resolve('./seed_data/carros/marcas/marcas'));
      if (marcasFile) {
        return importaModelos(marcasFile, configCarro);
      }
    }else {
      wrFile('./seed_data/carros/marcas/marcas.json', JSON.stringify(marcas.Common));
      return importaModelos(marcas.Common, configCarro);
    }
  });

  var config = {
    urlMarcas: 'http://www.webmotors.com.br/moto/marcasativas?tipoAnuncio=novos-usados',
    urlModelo: 'http://www.webmotors.com.br/moto/modelosativos?marca=',
    caminhoAqruivos: './seed_data/motos/marcas/modelos/',
    categoriaVeiculo: 'MOTO'
  };
  getMarcasFromWeb(config, function(err, marcas){
    if (err) {
      global.logger.error(err);
      var marcasFile = require(path.resolve('./seed_data/motos/marcas/marcas'));
      if (marcasFile) {
        return importaModelos(marcasFile, config);
      }
    }else {
      wrFile('./seed_data/motos/marcas/marcas.json', JSON.stringify(marcas.Common));
      return importaModelos(marcas.Common, config);
    }
  });
}

exports.seedMarca = seedMarca;

function importaModelos(marcas, config) {
  //console.log('entrou seedMarca');
  return new Promise(function (resolve, reject) {

    //console.log('entrou Promise');
    //console.log(marcas);
    var fileAsync = require('async');
    var filaModelos = fileAsync.queue(function(modelo, cbModelo){
      saveModelo(modelo, function(err, modelo){
        if (err) {
          global.logger.error(err);
          cbModelo(err);
        }else {
          cbModelo(null, 'Marca:' + modelo.marca.nome + ' Modelo:' + modelo.nome);
        }
      });
    },1);
    //var q = fileAsync.queue(, 1);

    var processaMarca = function(callback, task) {
      setTimeout(function(){
        saveMarca(task.marca, function(err, marcaBanco){
          if (err) {
            //callback(err,null);
            global.logger.error(err);
          }
          if (marcaBanco) {

            task.url = removeDiacritics(task.url);
            //global.logger.info('consultando:' + task.url);
            var requestOptions = { encoding: null, method: 'GET', uri: task.url };

            request(requestOptions, function (err, res, body) {
              var fileNameMarcaModelos = task.caminhoAqruivos + task.marca.N + '.json';
              fileNameMarcaModelos = removeDiacritics(fileNameMarcaModelos);
              var modelosMarca =[];
              if (err){
                //callback(err);
                global.logger.error(err);
                fs.stat(path.resolve(fileNameMarcaModelos), function(err, stat){
                  if (err) {
                    callback(err, null);
                  }else {
                    if (stat.isFile()) {
                      var marcasModeloFile = require(path.resolve(fileNameMarcaModelos));
                      if (marcasModeloFile) {
                        modelosMarca = marcasModeloFile;
                      }
                      for (var i = 0; i < modelosMarca.length; i++) {
                        var modelo = {};
                        modelo.marca = marcaBanco;
                        modelo.nome = modelosMarca[i].N;
                        filaModelos.push(modelo, callbackCadastroModelo);
                      }
                    }
                  }
                });
              } else if(res.statusCode !== 200){
                global.logger.error('Respondeu diferente de 200' + res);
                callback(res, null);
              }else {
                //console.log('Marca ' + marcaBanco.nome + ' respondeu:' + body);
                modelosMarca = JSON.parse(body);

                if (modelosMarca.length>0) {
                  wrFile(fileNameMarcaModelos, JSON.stringify(modelosMarca));
                  for (var i = 0; i < modelosMarca.length; i++) {
                    var modelo = {};
                    modelo.marca = marcaBanco;
                    modelo.nome = modelosMarca[i].N;
                    filaModelos.push(modelo, callbackCadastroModelo);
                  }
                }
              }
            });
          }else {
            callback(null, 'Sem marca para processar');
          }
        });
        callback(null,'success');
      }, task.timeout);
    };


    var filaProcessamentoMarcas =[];
    for (var i = 0; i < marcas.length; i++) {
      var c = {};
      c.codigo = i;
      c.marca = marcas[i];
      c.marca.categoriaVeiculo = config.categoriaVeiculo;
      c.timeout = i * 100;
      c.url = config.urlModelo + marcas[i].N.replace(' ', '+');
      c.caminhoAqruivos = config.caminhoAqruivos;

      filaProcessamentoMarcas.push(processaMarca(terminouFila, c));
    }

    fileAsync.series(filaProcessamentoMarcas, function(err, result){
      if (err) {
        global.logger.error('Erro no processamento em série:' + err);
      }else {
        //console.log('Processamento em série terminado.' + result);
      }
    });

    function terminouFila(err, success){
      if (err) {
        global.logger.error('Erro no processamento da fila:' + err);
      }else {
        //console.log('Terminou a fila: ' + success);
      }
    }
    function callbackCadastroModelo(err, success){
      if (err) {
        global.logger.error(err);
      }else {
        console.log(success);
      }
    }

  });
}
