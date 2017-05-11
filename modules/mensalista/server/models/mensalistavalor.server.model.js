'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mensalista Schema
 */
var MensalistaValorSchema = new Schema({
  valor: {
    type: Number,
    required: 'Entre com o nome completo'
  },
  ativo: {
    type: Boolean,
    required : true,
    default: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  disabled: {
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('MensalistaValor', MensalistaValorSchema);
