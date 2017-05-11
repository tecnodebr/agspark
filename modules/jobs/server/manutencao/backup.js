'use strict';

var schedule = require('node-schedule');
var path = require('path');
var config = require(path.resolve('./config/config'));
var job = {};
var fs = require('fs');

exports.start = function () {
  jobStart();
};

function jobStart() {
  job = schedule.scheduleJob('*/60 * * * *', function () {
    createBackup();
  });
}

exports.createBackup = createBackup;

function createBackup(callback) {
  var archiver = require('archiver');
  var exec = require('child_process').exec;
  var argv = require('yargs').argv;
  var moment = require('moment');
  var path = require('path');
  var year = moment().format('YYYY');
  var month = moment().format('MM');
  var fileDate = moment().format('YYYYMMDDHHmm');
  var outputDirectory = path.join(config.db.backupFolder, 'bkpTecnodePark' + fileDate);
  var zipFile = path.join(config.db.backupFolder, fileDate + '.zip');

  console.log(outputDirectory);

  var spawn = require('child_process').spawn;

  var args = ['--db', 'mean-dev', '--out', outputDirectory];

  var mongodumpPaths = ['/Program Files/MongoDB/Server/3.2/bin/mongodump.exe',
  '/mongodb/bin/mongodump.exe',
  '/usr/bin/mongodump',
  '/usr/local/bin/mongodump'];

  processaBackup(mongodumpPaths);

  function processaBackup(path) {
    if (path.length == 0) {
      console.log('Backup path is empty!');
      return;
    }


    fs.stat(path[0], trataRetorno);

    function trataRetorno(err, stats) {

      if (err) {
        console.log(err);
        console.log('mongodump not found:' + path[0]);
        path.splice(0, 1);
        processaBackup(path);
      } else if (stats.isFile()) {
        console.log('mongodump found, backuping...');
        var mongodump = spawn(path[0], args);

        mongodump.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
        });
        mongodump.stderr.on('data', function (data) {
          //console.log('stderr: ' + data);
        });
        mongodump.on('exit', function (code) {
          //console.log('mongodump exited with code ' + code);
          if (code === 0) {
            var zipFileName = outputDirectory + '.zip';
            var output = fs.createWriteStream(zipFileName);
            var archive = archiver('zip');

            output.on('close', function () {
              //console.log(archive.pointer() + ' total bytes');
              //console.log('archiver has been finalized and the output file descriptor has closed.');
              console.log('Backup realizado! Arquivo:' + zipFileName);
              console.log('Apagando diretório de bkp:' + outputDirectory);
              deleteFolderRecursive(outputDirectory);
              if (callback) {

                callback(null, { message: 'Backup realizado!', fileName: zipFileName });
              }
            });

            archive.on('error', function (err) {
              if (callback) {
                callback(err, null);
              }
              throw err;
            });

            archive.pipe(output);
            archive.bulk([
              { expand: true, cwd: outputDirectory, src: ['**'] }
            ]);
            archive.finalize();
          }
        });
      }
    }
  }
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
        //console.log(curPath);
      } else { // delete file
        //console.log(curPath);
        fs.unlinkSync(curPath);
      }
    });
    console.log(path);
    fs.rmdirSync(path);
  }
}
