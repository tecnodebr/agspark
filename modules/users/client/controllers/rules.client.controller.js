'use strict';

//Rules controller
angular.module('rules').controller('RulesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rules',
  function ($scope, $stateParams, $location, Authentication, Rules) {
    $scope.authentication = Authentication;

    // Create new rule
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ruleForm');

        return false;
      }

      // Create new Rule object
      var rule = new Rules({
        name: this.name,
        active: this.active,
        route: this.route,
        permissions: this.permissions
      });

      // Redirect after save
      rule.$save(function (response) {
        $location.path('rules/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.active = true;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing rule
    $scope.remove = function (rule) {
      if (rule) {
        rule.$remove();

        for (var i in $scope.rule) {
          if ($scope.rules[i] === rule) {
            $scope.rules.splice(i, 1);
          }
        }
      } else {
        $scope.rule.$remove(function () {
          $location.path('rules');
        });
      }
    };

    // Update existing rule
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ruleForm');

        return false;
      }

      var rule = $scope.rule;

      rule.$update(function () {
        $location.path('rules/' + rule._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of rules
    $scope.find = function () {
      $scope.rules = Rules.query();
    };

    // Find existing rule
    $scope.findOne = function () {
      $scope.rule = Rules.get({
        ruleId: $stateParams.ruleId
      });
    };
  }
]);
