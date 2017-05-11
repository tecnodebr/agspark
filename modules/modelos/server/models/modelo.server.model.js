'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Modelo Schema
 */
var ModeloSchema = new Schema({
  nome: {
    type: String,
    default: '',
    required: 'Informe o nome do modelo',
    trim: true
  },
  marca: {
    type: Schema.ObjectId,
    ref: 'Marca'
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

mongoose.model('Modelo', ModeloSchema);
