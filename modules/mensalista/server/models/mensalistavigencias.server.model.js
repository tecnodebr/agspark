'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mensalista Schema
 */
var MensalistaVigenciasSchema = new Schema({
  mensalista: {
    type: Schema.ObjectId,
    ref: 'Mensalista'
  },
  vigencia : {
    ano : { type: Number, required : 'Ano da competência é obrigatório' },
    mes : { type: Number, min : [1, 'vigência inválida'], max : [12, 'vigência inválida'], required : 'Mês da vigência é obrigatório' }
  },
  valor : {
    type: Number,
    required : 'Valor da mensalidade é obrigatório'
  },
  status: {
    type: String,
    enum: ['aberto', 'pago', 'atraso', 'cancelado'],
    required : 'Status da vigência é obrigatório',
    default: 'aberto'
  },
  datapagamento : { type: Date },
  periodovalidade: {
    inicio : { type: Date, default: Date.now, required : 'Data de inicio da vigência é obrigatório' },
    fim : { type: Date, default: Date.now, required : 'Data de final da vigência é obrigatório' }
  },
  observacao: {
    type: String
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

mongoose.model('MensalistaVigencias', MensalistaVigenciasSchema);
