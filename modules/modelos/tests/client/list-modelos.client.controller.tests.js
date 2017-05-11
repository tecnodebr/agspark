(function () {
  'use strict';

  describe('Modelos List Controller Tests', function () {
    // Initialize global variables
    var ModelosListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ModelosService,
      mockModelo;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ModelosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ModelosService = _ModelosService_;

      // create mock article
      mockModelo = new ModelosService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Modelo Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Modelos List controller.
      ModelosListController = $controller('ModelosListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockModeloList;

      beforeEach(function () {
        mockModeloList = [mockModelo, mockModelo];
      });

      it('should send a GET request and return all Modelos', inject(function (ModelosService) {
        // Set POST response
        $httpBackend.expectGET('api/modelos').respond(mockModeloList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.modelos.length).toEqual(2);
        expect($scope.vm.modelos[0]).toEqual(mockModelo);
        expect($scope.vm.modelos[1]).toEqual(mockModelo);

      }));
    });
  });
})();
