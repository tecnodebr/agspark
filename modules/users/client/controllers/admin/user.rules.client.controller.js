'use strict';

angular.module('userrules').controller('UserRulesController', ['$scope', '$state', '$filter', 'Authentication', 'adminUserRulesResolve',
  function ($scope, $state, $filter, Authentication, adminUserRulesResolve) {

    $scope.authentication = Authentication;
    $scope.user = adminUserRulesResolve.Admin;
    $scope.allRules = adminUserRulesResolve.Rules;
    $scope.userRulesPresentation = [];

    $scope.containsObject = function(obj, list) {
      var i;
      for (i = 0; i < list.length; i++) {
        if (angular.equals(list[i], obj._id)) {
          return true;
        }
      }

      return false;
    };


    $scope.listRulesUser = function (isValid) {
      var log = [];
        //$scope.allRules = Rules.query();
      $scope.allRules.$promise.then(
          function(data){
            $scope.user.$promise.then(
              function(user){
                angular.forEach(data, function(value, key){
                  if(!($scope.containsObject(value, $scope.user.rules))) {
                    value.active = false;
                    //$scope.user.rules.push(value);

                  }
                  else {
                    value.active = true;
                    //$scope.user.rules.push(value);
                  }
                  $scope.userRulesPresentation.push(value);
                }, log);
              });
          });
    };

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.allRules, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.updateRules = function (isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userRuleForm');
        return false;
      }
      var log = [];
      var user = $scope.user;
      user.rules = [];
      angular.forEach($scope.userRulesPresentation, function(value, key){

        if(value.active){
          user.rules.push(value);
        }
      }, log);
      user.$update(function () {
        $state.go('userrules', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
