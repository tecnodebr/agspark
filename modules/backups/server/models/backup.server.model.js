'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Backup Schema
 */
var BackupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Backup name',
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

mongoose.model('Backup', BackupSchema);
