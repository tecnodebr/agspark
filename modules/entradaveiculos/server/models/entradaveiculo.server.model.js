'use strict';




/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Entradaveiculo Schema
 */
var EntradaveiculoSchema = new Schema({
  placaLetras: {
    type: String,
    default: '',
    required: 'Letras da placa do veículo.',
    trim: true
  },
  placaNumeros: {
    type: Number,
    default: '',
    required: 'Números da placa do veículo.',
    trim: true
  },
  veiculo: {},
  numeroPrisma:{
    type : Number
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  dynamicProperties: {},
  _idEntradaveiculo:{
    type: Number
  },
  fotosEntrada: [{ data: Buffer, contentType: String }],
  valorEstadia:{
    type: Number,
    default:0
  },
  valorPago:{
    type:Number,
    default:0
  },
  valorTroco:{
    type:Number,
    default:0
  },
  fotoSaida: {
    type : String,
    default: '',
    trim: true
  },
  dataSaida:{
    type : Date,
    default: null
  },
  corVeiculo:{
    type: String
  }
});

mongoose.model('Entradaveiculo', EntradaveiculoSchema);

var CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
var counterSchemaModel = mongoose.model('EntradaveiculoCounterSchema', CounterSchema);


EntradaveiculoSchema.pre('save', function(next) {
  var doc = this;
  var LocalEntradaveiculoCounterSchema = mongoose.model('EntradaveiculoCounterSchema');

  LocalEntradaveiculoCounterSchema.findByIdAndUpdate({ _id: 'idContador' }, { $inc: { seq: 1 } }, function(error, counter) {
    if(error)
      return next(error);

    if (counter === null) {

      var counterSchema = new LocalEntradaveiculoCounterSchema({ _id:'idContador', seq:0 });
      counterSchema.save(function(err) {
        if (err) {
          return next(error);
        } else {
          LocalEntradaveiculoCounterSchema.findByIdAndUpdate({ _id: 'idContador' }, { $inc: { seq: 1 } }, function(error, counter) {
            if(error)
              return next(error);
            doc._idEntradaveiculo = counter.seq;
            next();
          });
        }
      });
    }else{
      doc._idEntradaveiculo = counter.seq;
      next();
    }
  });
});
