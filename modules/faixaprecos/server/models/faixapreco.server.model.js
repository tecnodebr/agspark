'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Faixapreco Schema
 */
var FaixaprecoSchema = new Schema({
  descricao: {
    type: String,
    default: '',
    required: 'Informe uma descrição',
    trim: true
  },
  tempoInicial:{
    type: Number,
    required: 'Informe o tempo em minutos que o sistema irá considerar com o inicial da faixa.'
  },
  tempoFinal:{
    type: Number,
    required: 'Informe o tempo final em minutos da faixa.'
  },
  tempoAdicional:{
    type: Number,
    required: 'Informe o tempo em minutos do valor adicional.'
  },
  valorTempoNormal:{
    type: Number,
    required: 'Valor normal da faixa.'
  },
  valorTempoAdicional:{
    type: Number,
    required: 'Valor de tempo adicional.'
  },

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Faixapreco', FaixaprecoSchema);
