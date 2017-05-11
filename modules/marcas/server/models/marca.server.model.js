'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Marca Schema
 */
var MarcaSchema = new Schema({
  nome: {
    type: String,
    default: '',
    required: 'Nome da marca',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  categoriaVeiculo: {
    type: String,
    enum: ['MOTO', 'CARRO']
  },
});

mongoose.model('Marca', MarcaSchema);
