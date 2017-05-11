'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mensalista Schema
 */
var MensalistaSchema = new Schema({
  nome: {
    type: String,
    default: '',
    required: 'Entre com o nome completo',
    trim: true
  },
  cpf: {
    type: String,
    required: 'Informe o CPF'
  },
  rg: {
    type: String,
    required: 'Informe o RG'
  },
  endereco: {
    type: String,
    required: 'Informe o endereço completo'
  },
  complemento: {
    type: String
  },
  telefones:[],
  carros:[{
    placaLetras:{
      type: String,
      required: 'Informe a placa do veículo'
    },
    placaNumeros:{
      type: Number,
      required: 'Informe a placa do veículo'
    },
    marcaModelo:{
    
    },
    corVeiculo:{
      type: String
    },
    created: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    diasDaSemana:[{
      nome:{
        type:String
      },
      codigo:{
        type: Number
      },
      selecionado:{
        type: Boolean
      },
      horarioInicial: Date,
      horarioFinal: Date
    }]
  }],
  status: {
    type: String,
    enum: ['aberto', 'pago', 'atraso', 'cancelado'],
    required : 'Status é obrigatório',
    default: 'aberto'
  },
  created: {
    type: Date,
    default: Date.now
  },
  canceled: {
    type: Date,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Mensalista', MensalistaSchema);
