'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rule Schema
 */
var RoleSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Role name cannot be blank',
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
  rules: [{
    rule: { type: Schema.ObjectId, ref:'Rule' },
    permissions: {
      type: String,
      default: '*',
      trim: true
    },
    associated: {
      type: Date,
      default: Date.now
    }
  }],
  menus : [{
    menu :  { type: Schema.ObjectId, ref:'Menu' },
    associated: {
      type: Date,
      default: Date.now
    }
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Role', RoleSchema);
