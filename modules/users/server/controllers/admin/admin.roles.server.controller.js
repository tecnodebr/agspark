'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Role = mongoose.model('Role'),
  Rule = mongoose.model('Rule'),
  query = require('array-query'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


exports.delete = function (req, res) {
  var role = req.role;

  role.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(role);
    }
  });
};

exports.create = function (req, res) {
  var role = new Role(req.body);
  role.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(role);
    }
  });
};

exports.read = function (req, res) {
  Role.findById(req.params.roleId).exec(function (err, role) {
    if (err) {
      return res.status(500).send({
        message: err
      });
    } else if (!role) {
      return res.status(404).send({
        message: 'Papel não encontrado'
      });
    }
    res.json(role);
  });
};

exports.readWithRulesAssociation = function (req, res) {
  var roleId = req.params.roleId;

  if (!mongoose.Types.ObjectId.isValid(roleId)) {
    return res.status(400).send({
      message: 'Papel inválido'
    });
  }

  Role.findById(roleId).exec(function (err, role) {

    if (err) {
      return res.status(500).send({
        message: err
      });
    } else if (!role) {
      return res.status(404).send({
        message: 'Papel não encontrado'
      });
    }

    Rule.find({ active: true }).exec(function (err, rules) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      rules.forEach(function(rule) {
        var userRuleExist = query.select(role.rules).where('rule.id.toString()').equals(rule._id.toString()).end();
        if (userRuleExist == null || userRuleExist == undefined || userRuleExist.length <= 0) {
          role.rules.push({ rule: { id : rule._id, name: rule.name } , associated: null });
        }
      });

      res.json(role);
    });
  });
};

exports.updateRules = function (req, res) {
  var roleId = req.params.roleId;

  if (!mongoose.Types.ObjectId.isValid(roleId)) {
    return res.status(400).send({
      message: 'Papel inválido'
    });
  }

  Role.update({ _id: roleId }, {
    rules : req.body.rules
  }, function(err, numberAffected, rawResponse) {
    exports.readWithRulesAssociation(req, res);
  });

};


exports.update = function (req, res) {
  var role = req.role;
    //For security purposes only merge these parameters
  role.name = req.body.name;
  role.active = req.body.active;
  role.rules = req.body.rules;

  role.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(role);
  });
};

exports.list = function (req, res) {
  Role.find({}).sort('-created').populate('role', 'name').exec(function (err, roles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(roles);
  });
};
