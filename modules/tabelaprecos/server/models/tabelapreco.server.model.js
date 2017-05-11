'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tabelapreco Schema
 */
var TabelaprecoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Informe um nome para a tabela',
    trim: true
  },
  descricao: {
    type: String,
    default: '',
    trim: true
  },
  // Faixas de preços que formam esta tabela de preço, ex. Tabela avulsa de segunda a sexta.
  precos: [{ type: Schema.ObjectId, ref: 'Faixapreco' }],
  created: {
    type: Date,
    default: Date.now
  },
  diasDaSemana:[{
    nome:{
      type:String
    },
    codigo:{
      type:Number
    },
    selecionado:{
      type:Boolean
    }
  }],
  ativo:{
    type:Boolean
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Tabelapreco', TabelaprecoSchema);
