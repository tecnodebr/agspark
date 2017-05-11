(function () {
  'use strict';

  describe('Mensalista Controller Tests', function () {
    // Initialize global variables
    var MensalistaController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      MensalistaService,
      mockMensalista;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MensalistaService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      MensalistaService = _MensalistaService_;

      // create mock Mensalista
      mockMensalista = new MensalistaService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Mensalista Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Mensalista controller.
      MensalistaController = $controller('MensalistaController as vm', {
        $scope: $scope,
        mensalistaResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleMensalistaPostData;

      beforeEach(function () {
        // Create a sample Mensalista object
        sampleMensalistaPostData = new MensalistaService({
          name: 'Mensalista Name'
        });

        $scope.vm.mensalista = sampleMensalistaPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (MensalistaService) {
        // Set POST response
        $httpBackend.expectPOST('api/mensalista', sampleMensalistaPostData).respond(mockMensalista);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Mensalista was created
        expect($state.go).toHaveBeenCalledWith('mensalista.view', {
          mensalistaId: mockMensalista._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/mensalista', sampleMensalistaPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Mensalista in $scope
        $scope.vm.mensalista = mockMensalista;
      });

      it('should update a valid Mensalista', inject(function (MensalistaService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/mensalista\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('mensalista.view', {
          mensalistaId: mockMensalista._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (MensalistaService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/mensalista\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Mensalista
        $scope.vm.mensalista = mockMensalista;
      });

      it('should delete the Mensalista and redirect to Mensalista', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/mensalista\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('mensalista.list');
      });

      it('should should not delete the Mensalista and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
