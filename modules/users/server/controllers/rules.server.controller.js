'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rule = mongoose.model('Rule'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a rule
 */
exports.create = function (req, res) {
  var rule = new Rule(req.body);
  rule.user = req.user;

  rule.save(function (err) {
    console.log(err);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rule);
    }
  });
};

/**
 * Show the current rule
 */
exports.read = function (req, res) {

  res.json(req.rule);
};

/**
 * Update a rule
 */
exports.update = function (req, res) {
  var rule = req.rule;

  rule.name = req.body.name;
  rule.active = req.body.active;

  rule.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rule);
    }
  });
};

/**
 * Delete an rule
 */
exports.delete = function (req, res) {
  var rule = req.rule;

  rule.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rule);
    }
  });
};

/**
 * List of rules
 */
exports.list = function (req, res) {
  Rule.find().sort('-created').populate('user', 'displayName').exec(function (err, rules) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rules);
    }
  });
};

/**
 * rule middleware
 */
exports.ruleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rule is invalid'
    });
  }

  Rule.findById(id).populate('user', 'displayName').exec(function (err, rule) {
    if (err) {
      return next(err);
    } else if (!rule) {
      return res.status(404).send({
        message: 'No rule with that identifier has been found'
      });
    }
    req.rule = rule;
    next();
  });
};
