'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
mongoose = require('mongoose'),
Backup = mongoose.model('Backup'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
_ = require('lodash');

/**
* Create a Backup
*/
exports.create = function(req, res) {

  // var smarca = require(path.resolve('./config/lib/seed/marca'));
  // smarca.seedMarca();

  //var backup = new Backup(req.body);
  var backupService = require(path.resolve('./modules/jobs/server/manutencao/backup'));
  backupService.createBackup(function(err, success){
    if (err) {
      return res.status(400).send({
        message: err
      });
    }else {
      success.fileName = path.basename(success.fileName);
      res.jsonp(success);
      //var filename = path.basename(success.fileName);
      //path = path.resolve('./public/backup/' + filename);
      //console.log(path);
      //res.download(path);
    }
  });
};

/**
* Show the current Backup
*/
exports.read = function(req, res) {
  console.log('read');
  // convert mongoose document to JSON
  var backup = req.backup ? req.backup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  backup.isCurrentUserOwner = req.user && backup.user && backup.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(backup);

};

/**
* Update a Backup
*/
exports.update = function(req, res) {
  var backup = req.backup ;

  backup = _.extend(backup , req.body);

  backup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(backup);
    }
  });
};

/**
* Delete an Backup
*/
exports.delete = function(req, res) {
  var backup = req.backup ;

  backup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(backup);
    }
  });
};

/**
* List of Backups
*/
exports.list = function(req, res) {
  Backup.find().sort('-created').populate('user', 'displayName').exec(function(err, backups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(backups);
    }
  });
};

/**
* Backup middleware
*/
exports.backupByID = function(req, res, next, id) {
  console.log('backupByID');
  var caminho = path.resolve('./public/backup/' + id);
  res.download(caminho, id, function(err){
    if (err) {
      global.logger.error(err);
    }
    //next();
  });
  /*
  if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).send({
  message: 'Backup is invalid'
});
}

Backup.findById(id).populate('user', 'displayName').exec(function (err, backup) {
if (err) {
return next(err);
} else if (!backup) {
return res.status(404).send({
message: 'No Backup with that identifier has been found'
});
}
req.backup = backup;
next();
});
*/
};
