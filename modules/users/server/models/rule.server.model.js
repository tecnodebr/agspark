'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rule Schema
 */
var RuleSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Rule name cannot be blank',
    unique: true
  },
  route: {
    type: String,
    trim: true,
    required: 'Rule route cannot be blank',
    unique: true
  },
  active: {
    type: Boolean,
    default: true
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

mongoose.model('Rule', RuleSchema);
