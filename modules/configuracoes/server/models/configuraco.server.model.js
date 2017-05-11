'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Configuraco esSchema
 */
var ConfiguracoesSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Configuracoes name',
    trim: true
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

mongoose.model('Configuracoes', ConfiguracoesSchema);
