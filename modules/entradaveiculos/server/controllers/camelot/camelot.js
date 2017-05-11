'use strict';


var spawn = require('child_process').spawn,
  util = require('util'),
  uuid = require('node-uuid'),
  events = require('events'),
  fs = require('fs'),
  logger = require('winston');

var imagesLocation = './public/images/';
//fs.mkdir(location, 0777);

var _options = {
  verbose: true,
  device : '/dev/video1',
  resolution : '1280x720',
  png : '1',
  greyscale : false,
  title : 'Camelot!',
  font : 'Arial:12',
  controls : {
    focus : 'auto'
    /*    brightness : 0,
    contrast : 136,
    saturation : 150,
    hue : 0,
    gamma : 100,
    sharpness : 50
    */
  }
};




(function() {
  var childProcess = require('child_process');
  var oldSpawn = childProcess.spawn;
  function mySpawn() {
    console.log('spawn called2');
    console.log(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
  }
  childProcess.spawn = mySpawn;
})();


var mixin = function (source, destination) {

  if (typeof (source) == 'object') {
    for (var prop in source) {
      if ((typeof (source[prop]) == 'object') && (source[prop] instanceof Array)) {
        if (destination[prop] === undefined) {
          destination[prop] = [];
        }
        for (var index = 0; index < source[prop].length; index += 1) {
          if (typeof (source[prop][index]) == 'object') {
            if (destination[prop][index] === undefined) {
              destination[prop][index] = {};
            }
            destination[prop].push(mixin(source[prop][index], destination[prop][index]));
          } else {
            destination[prop].push(source[prop][index]);
          }
        }
      } else if (typeof (source[prop]) == 'object') {
        if (destination[prop] === undefined) {
          destination[prop] = {};
        }
        mixin(source[prop], destination[prop]);
      } else {
        destination[prop] = source[prop];
      }
    }
  }

  return destination;
};

var Camelot = function (options) {
  this.opts = mixin(options, _options);
  if (!this.opts.verbose) {
    logger.remove(logger.transports.Console);
  }
  //logger.info('init options: ' + JSON.stringify(this.opts));
  return this;
};

util.inherits(Camelot, events.EventEmitter);

Camelot.prototype.reset = function () {
  this.opts = _options;
  logger.info('reset options: ' + JSON.stringify(this.opts));
  return _options;
};

Camelot.prototype.grab =
function (options, callback) {

  this.opts = mixin(options, this.opts);
  //logger.info('with options: ' + JSON.stringify(this.opts));

  var grabber =
  function () {

    events.EventEmitter.call(this);
    var self = this;
    self.arguments = [];
    self.format = '.jpg';

    var devicePath = this.opts.device.toString();
    fs.exists(devicePath, function checkExists(exists) {

      var p = function pConfigure() {

        for (var option in this.opts) {
          switch (option) {
            case 'device':
              break;
            case 'greyscale':
              if (self.opts[option] === true) {
                self.arguments.push('--' + option);
                self.arguments.push(self.opts[option]);
              }
              break;
            case 'png':
              self.format = '.png';
              self.arguments.push('--' + option);
              self.arguments.push(self.opts[option]);
              break;
            case 'controls':
              for (var control in self.opts[option]) {
                switch (control) {
                  case 'brightness':
                    var brightness =
                self.opts.controls.brightness > 127 ? 127 : self.opts.controls.brightness;
                    brightness = brightness < -128 ? -128 : brightness;
                    self.arguments.push('--set');
                    self.arguments.push('Brightness=' + brightness + '');
                    continue;
                  case 'contrast':
                    var contrast =
                self.opts.controls.contrast > 255 ? 255 : self.opts.controls.contrast;
                    contrast = contrast < 60 ? 60 : contrast;
                    self.arguments.push('--set');
                    self.arguments.push('Contrast=' + contrast + '');
                    continue;
                  case 'saturation':
                    var saturation =
                self.opts.controls.saturation > 255 ? 255 : self.opts.controls.saturation;
                    saturation = saturation < 0 ? 0 : saturation;
                    self.arguments.push('--set');
                    self.arguments.push('Saturation=' + saturation + '');
                    continue;
                  case 'gamma':
                    var gamma = self.opts.controls.gamma > 500 ? 500 : self.opts.controls.gamma;
                    gamma = gamma < 75 ? 75 : gamma;
                    self.arguments.push('--set');
                    self.arguments.push('Gamma=' + gamma + '');
                    continue;
                  case 'sharpness':
                    var sharpness =
                self.opts.controls.sharpness > 255 ? 255 : self.opts.controls.sharpness;
                    sharpness = sharpness < 0 ? 0 : sharpness;
                    self.arguments.push('--set');
                    self.arguments.push('Sharpness=' + sharpness + '');
                    continue;
                  case 'hue':
                    var hue = self.opts.controls.hue > 127 ? 127 : self.opts.controls.hue;
                    hue = hue < -128 ? -128 : hue;
                    self.arguments.push('--set');
                    self.arguments.push('Hue=' + hue + '');
                    continue;
                  case 'focus':
                    if (self.opts.controls.focus === 'auto') {
                      self.arguments.push('--set');
                      self.arguments.push('Focus, Auto=1');
                    } else {
                      var focus = self.opts.controls.focus > 200 ? 200 : self.opts.controls.focus;
                      focus = focus < 0 ? 0 : focus;
                      self.arguments.push('--set');
                      self.arguments.push('Focus, Auto=0');
                      self.arguments.push('--set');
                      self.arguments.push('Focus (absolute)=' + focus + '');
                    }
                    continue;
                  default:
                    continue;
                }
              }
              break;
            default:
              self.arguments.push('--' + option);
              self.arguments.push(self.opts[option]);
              break;
          }
        }

        var file = imagesLocation + uuid() + self.format;

        self.arguments.push('--save', file);


        var fswebcam = spawn('fswebcam', self.arguments);

/*
        fswebcam.stderr.on('data', function (data) {
          console.log('stdout: ' + data);
          var message = 'device not found (' + self.opts.device + '). err:' + data;
          logger.error(message);
          var err = new Error(message);
          callback(err);
        });
*/
        fswebcam.on('error', function(err){
          console.log('Erro ao tentar encontrar o commando no "fswebcam" no sistema operacional, verifique se o programa "fswebcam" está instalado.');
          if (callback) {
            callback(err, null);
          }
        });

        fswebcam.on('exit', function (code) {
          logger.info('Entrou no fswebcam exit... code:' + JSON.stringify(code));
          logger.info('Entrou no fswebcam exit... file:' + JSON.stringify(file));
          fs.exists(file, function (exists) {
            if (!exists) {
              var err = new Error('Frame file unavailable. exists:' + JSON.stringify(exists));
              self.emit('error', err);
              if (callback) {
                callback.call(err, null);
              }
            } else {
              //logger.info('Caminho do fswebcam...');
              fs.readFile(file, function (err, data) {

                if (err) {
                  logger.info('Entrou no erro...');
                  self.emit('error', err);
                  if (callback) {
                    logger.info('Chamou o callback.');
                    callback.call(err, null);
                  }
                } else {

                  self.emit('frame', data);
                  fs.unlink(file);
                  if (callback) {
                    callback(null, data);
                  }
                }
              });
            }
          });
        });
      };

      if (!exists) {
        var message = 'device not found (' + self.opts.device + ').';
        logger.error(message);
        var err = new Error(message);
        self.emit('error.device', err);
        if (callback) {
          callback.call(err, null);
        }
        fs.watchFile(self.opts.device, function (curr, prev) {
          logger.info('device status changed.');
          p.apply(self);
        });
        return;
      }
      p.apply(self);
    });
  };

  if (this.opts.frequency) {
    setInterval(function (self) {
      grabber.apply(self);
    }, 1000 * this.opts.frequency, this);
  } else {
    grabber.apply(this);
  }
};

Camelot.prototype.update = function (options) {
  this.opts = mixin(options, this.opts);
  logger.info('update options: ' + JSON.stringify(this.opts));
  return this.opts;
};


/*
if (process.versions.node.split(".")[1] < 8 ){
fs.exists = require('path').exists;
}
*/
module.exports = Camelot;
