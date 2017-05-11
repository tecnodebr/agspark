'use strict';

var tecnodeAppModule = angular.module('tecnode.directives', ['ngMaterial', 'ngMessages'])

.directive('autoTabTo', [function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, el, attrs, ngModel) {
      angular.element(el).on('keyup', function(e) {
        var key = e.keyCode;
        if (key === 8 | key === 46) {
          return;
        }
        var input = document.getElementById(ngModel.$name);
        if(ngModel.$viewValue != null && ngModel.$viewValue != undefined && ngModel.$viewValue.toString().length === input.maxLength) {
          var element = document.getElementById(attrs.autoTabTo);
          if (element)
          element.focus();
        }
      });
    }
  };
}])

.directive('mesNumericValidation', [function () {
  return {
    restrict: 'A',
    scope: true,
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      angular.element(element).on('blur', function(e) {
        scope.$apply(function() {
          var valid = true;
          if(parseInt(ngModel.$viewValue.toString()) <= 0 || parseInt(ngModel.$viewValue.toString()) > 12)
          valid = false;
          ngModel.$setValidity('mesnumericvalidation', valid);
        });
      });
    }
  };
}])


.directive('anoNumericValidation', [function () {
  return {
    restrict: 'A',
    scope: true,
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      angular.element(element).on('blur', function(e) {
        scope.$apply(function() {
          var valid = true;
          if(ngModel.$viewValue.toString().length != 4)
          valid = false;
          ngModel.$setValidity('anonumericvalidation', valid);
        });
      });
    }
  };
}])
.directive('nonZeroValidation', [function () {
  return {
    restrict: 'A',
    scope: true,
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      angular.element(element).on('blur', function(e) {
        scope.$apply(function() {
          var valid = true;
          if (ngModel.$viewValue) {
            if(parseFloat(ngModel.$viewValue.replace(',','.')) <= 0)
            valid = false;
          }
          ngModel.$setValidity('nonzerovalidation', valid);
        });
      });
    }
  };
}])
.directive('tooltip', function(){
  return {
    restrict: 'A',
    controller: function($scope, $element) {
      $scope.isShown = [];
      $scope.title = [];
      $scope.left = [];
      $scope.isShown[name] = false;
      this.showHover = function(name, title, width, tooltipleft) {
        $scope.isShown[name] = $scope.isShown[name] == true ? false : true;
        if($scope.isShown)
        $scope.title[name] = title;
        else {
          $scope.title[name] = '';
        }
        if (tooltipleft) {
          $scope.left[name] = tooltipleft;
        }
        else {
          $scope.left[name] = ((0.1 * width) - 31.82);
        }

      };
    },
    transclude: true,
    scope: {
      uniqueId: '@'
    },
    template: '<div ng-transclude></div>' +
    '<div  ng-show="isShown[uniqueId]" class="tooltip bottom" style="opacity: 1; left:{{left[uniqueId]}}px;">' +
    '<div class="tooltip-arrow"></div>' +
    '<div class="tooltip-inner"><span data-ng-bind="title[uniqueId]"></span></div>' +
    '</div>',
    link: function(scope, element, attrs, ctrl){
      scope.uniqueId = attrs.name;
      angular.element(element).on('mouseenter', function() {
        scope.$apply(function() {
          ctrl.showHover(attrs.name, attrs.tooltip, element[0].clientWidth, attrs.tooltipleft);
        });
      });
      angular.element(element).on('mouseleave', function() {
        scope.$apply(function() {
          ctrl.showHover(attrs.name, attrs.tooltip, element[0].clientWidth, attrs.tooltipleft);
        });
      });
    }
  };
})
.directive('scrollTo', function() {
  return {
    link: function(scope, element, attrs) {
      var selector = attrs.scrollTo;
      angular.element(element).on('click', function(e) {
        scope.$apply(function() {
          var element = angular.element(document.getElementById(selector));
          if(element.length) {
            setTimeout(function(){ element[0].focus(); element[0].select(); element[0].scrollIntoView(); }, 300);
          }
        });
      });
    }
  };
})
.directive('replace', function() {
  return {
    require: 'ngModel',
    scope: {
      regex: '@replace',
      with: '@with'
    },
    link: function(scope, element, attrs, model) {
      model.$parsers.push(function(val) {
        if (!val) { return; }
        var regex = new RegExp(scope.regex);
        var replaced = val.replace(regex, scope.with);
        if (replaced !== val) {
          model.$setViewValue(replaced);
          model.$render();
        }
        return replaced;
      });
    }
  };
})
.directive('lettersOnly', function() {
  return {
    replace: true,
    template: '<input replace="[^a-zA-Z]" with="">'
  };
});

tecnodeAppModule.config(function($mdDateLocaleProvider) {
  // Example of a French localization.
  $mdDateLocaleProvider.months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  $mdDateLocaleProvider.shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  $mdDateLocaleProvider.days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  $mdDateLocaleProvider.shortDays = ['dom','seg', 'ter', 'quar', 'qui', 'sex', 'sab'];
  // Can change week display to start on Monday.
  $mdDateLocaleProvider.firstDayOfWeek = 1;
  // Optional.
  //$mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  // Example uses moment.js to parse and format dates.
  $mdDateLocaleProvider.parseDate = function(dateString) {
    moment.locale('pt-BR');
    var m = moment(dateString, 'DD/MM/YYYY', 'pt-BR', true);
    return m.isValid() ? m.toDate() : new Date(NaN);
  };
  $mdDateLocaleProvider.formatDate = function(date) {
    moment.locale('pt-BR');
    return moment(date).format('DD/MM/YYYY');
  };
  $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
    moment.locale('pt-BR');
    return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
  };
  // In addition to date display, date components also need localized messages
  // for aria-labels for screen-reader users.
  $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
    return 'Semana ' + weekNumber;
  };
  $mdDateLocaleProvider.msgCalendar = 'Calendário';
  $mdDateLocaleProvider.msgOpenCalendar = 'Abrir Calendário';
});
