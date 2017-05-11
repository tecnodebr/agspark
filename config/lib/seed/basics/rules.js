'use strict';


var path = require('path'),
    fs = require('fs');

var mongoose = require('mongoose');
var Rule = mongoose.model('Rule');
var seedRulesData = require(path.resolve('./seed_data/rules/rules.json'));

module.exports.seedAllRules = seedAllRules;

function seedAllRules() {
  return seedRulesList();
}


function seedRulesList(){
  var rulesPromissesArray = [];
  return new Promise(function(resolve, reject) {
    seedRulesData.rules.forEach(function(rule){
      rulesPromissesArray.push(new Promise(function(resolveItem, rejectItem) {
        Rule.findOne({ name : rule.name }).exec(function (err, ruleFound) {
          var newRule = {};
          if (ruleFound) {
            newRule = ruleFound;
          }
          else {
            newRule = new Rule();
          }
          newRule.name = rule.name;
          newRule.route = rule.resources;
          newRule.active = true;
          newRule.save(function(err) {
            if (err) {
              global.logger.error('[SEED]', { mensagem : JSON.stringify(err) });
              rejectItem(err);
            } else {
              resolveItem(newRule);
            }
          });
        });
      }));
    });

    Promise.all(rulesPromissesArray)
      .then(function(rules){ resolve(rules); })
      .catch(function(err){ global.logger.error('[SEED]', { mensagem : JSON.stringify(err) }); reject(err); });
  });
}
