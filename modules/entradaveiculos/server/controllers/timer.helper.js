'use strict';

exports.msToTime = function(duration) {
  if (!duration && duration === 0) {
    return 'Erro duração indefinida.';
  }


  var x = duration / 1000;
  var seconds = Math.round(x % 60);
  x /= 60;
  var minutes = Math.round(x % 60);
  x /= 60;
  var hours = Math.round(x % 24);
  x /= 24;
  var days = Math.round(x);

  if (hours < 1) {
    hours = 0;
  }else {
    hours = Math.round(hours);
  }

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  if (days>0) {
    if (days > 1) {
      return days + ' Dias ' + hours + ':' + minutes + ':' + seconds ;
    }else{
      return days + ' Dia ' + hours + ':' + minutes + ':' + seconds ;
    }

  }else {
    return hours + ':' + minutes + ':' + seconds ;
  }
};

exports.msToMinutes = function(duration){
  if (!duration && duration === 0) {
    return -1;
  }
  var x = duration / 1000;
  var minutes = x / 60;
  return minutes;
};
