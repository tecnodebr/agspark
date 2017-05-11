'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Caixa Schema
 */
var CaixaSchema = new Schema({
  valor:{
    // O valor pode ser positivo ou negativo, positivo quando entra dinheiro no caixa.
    type: Number,
    required: 'Valor requerido'
  },
  tipoEntrada:{
    // O tipo de entrada pode ser um dos 4 [ABERTURA, ENTRADA, SAIDA E FECHAMENTO]
    type: String,
    required: 'Tipo de entrada requerido',
    enum: ['ABERTURA', 'ENTRADA', 'SAIDA', 'FECHAMENTO']
  },
  formaDePagamento:{
    // A forma de pagamento poderá ser dinheiro, cheque ou cartão.
    // Este campo será usado para agrupar as formas de pagamento para a conferência no fechamento do caixa.
    type: String,
    enum: ['DINHEIRO', 'CHEQUE', 'CARTAOCREDITO', 'CARTAODEBITO']
  },
  observacao: {
    type: String,
    default: '',
    trim: true
  },
  entradaveiculo:{
    type: Schema.ObjectId,
    ref: 'EntradaVeiculo'
  },
  mensalistavigencias : [{
    type: Schema.ObjectId,
    ref: 'MensalistaVigencias'
  }],
  registroDeAbertura:{
    // Todo movimento no caixa exceto os de abertura terão relacionamento com um
    // registro de abertura, assim é possível mapear todos movimentos de uma determinada
    // abertura.
    type: Schema.ObjectId,
    ref: 'Caixa'
  },
  created: {
    // Data do registro
    type: Date,
    default: Date.now
  },
  user: {
    // Usuário que fez o registro
    type: Schema.ObjectId,
    ref: 'User'
  },
  dynamicProperties:{}
});

mongoose.model('Caixa', CaixaSchema);
