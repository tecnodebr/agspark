'use strict';

//Rules controller
angular.module('roles').controller('RolesController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'AdminRolerRulesResolve',
  function ($scope, $state, $stateParams, $location, Authentication, AdminRolerRulesResolve) {

    $scope.authentication = Authentication;
    $scope.role = {};
    // Create new rule
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'roleForm');
        //teste
        return false;
      }

      // Create new Role object
      var role = new AdminRolerRulesResolve.basic({
        name: this.name,
        active: this.active
      });

      // Redirect after save
      role.$save(function (response) {
        $location.path('roles/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.active = true;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing role
    $scope.remove = function (role) {
      if (role) {
        role.$remove();

        for (var i in $scope.role) {
          if ($scope.roles[i] === role) {
            $scope.roles.splice(i, 1);
          }
        }
      } else {
        $scope.role.$remove(function () {
          $location.path('roles');
        });
      }
    };

    // Update existing role
    $scope.updateRules = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'roleRulesForm');
        return false;
      }
      var log = [];
      var role = angular.copy($scope.role);

      for (var i = 0; i < role.rules.length; i++) {
        if(role.rules[i].associated)
          role.rules[i].associated = new Date();
        else {
          role.rules.splice(i, 1);
          i--;
        }
          //Do something
      }

      role.$updateRule(function (data) {
        for (var i = 0; i < data.rules.length; i++) {
          if(data.rules[i].associated !== null && data.rules[i].associated !== undefined)
            data.rules[i].associated = true;
        }
        $scope.role = data;
      }, function (errorResponse) {
      });
    };

    $scope.getRoleWithRulesAssociation = function () {
      $scope.role = AdminRolerRulesResolve.rules.get({
        roleId: $stateParams.roleId
      });
      $scope.role.$promise.then(
          function(data){
            for (var i = 0; i < data.rules.length; i++) {
              if($scope.role.rules[i].associated !== null && $scope.role.rules[i].associated !== undefined)
                $scope.role.rules[i].associated = true;
            }
          });
    };


    // Find a list of roles
    $scope.find = function () {
      $scope.roles = AdminRolerRulesResolve.basic.query();
    };

    // Find existing role
    $scope.findOne = function () {
      $scope.role = AdminRolerRulesResolve.basic.get({
        roleId: $stateParams.roleId
      });
    };
  }
]);
