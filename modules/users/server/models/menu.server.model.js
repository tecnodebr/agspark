'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rule Schema
 */
var MenuSchema = new Schema({
  title: {
    type: String
  },
  state: {
    type: String,
    unique: true,
    trim: true,
    required: 'Menu state cannot be blank'
  },
  submenus: [{
    type: Schema.ObjectId,
    ref: 'Menu'
  }],
  menutype: {
    type: String,
    enum: ['dropdown']
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

mongoose.model('Menu', MenuSchema);
