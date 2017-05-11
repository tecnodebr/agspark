'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Empresa Schema
 */
var EmpresaSchema = new Schema({
  nome: {
    type: String,
    default: '',
    required: 'Nome da empresa é obrigatório',
    trim: true
  },
  razao_social: {
    type: String,
    default: '',
    required: 'Razão Social é de preenchimento obrigatório',
    trim: true
  },
  cnpj: {
    type: String,
    default: '',
    required: 'CNPJ é de preenchimento obrigatório',
    trim: true
  },
  endereco: {
    logradouro : {
      type: String,
      default: '',
      required: 'logradouro é de preenchimento obrigatório',
      trim: true
    },
    numero : {
      type: String,
      default: '',
      trim: true
    },
    complemento : {
      type: String,
      default: '',
      trim: true
    },
    cidade : {
      type: String,
      default: '',
      trim: true
    },
    uf : {
      type: String,
      default: '',
      trim: true
    },
    cep :{
      type: String,
      default: '',
      trim: true
    }
  },
  telefone : { type: String, default: '', trim: true },
  horariofuncionamento : { type: String, default: '', trim: true },
  logo : { data: Buffer, contentType: String },
  data_criacao: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Empresa', EmpresaSchema);
