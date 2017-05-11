(function () {
  'use strict';

  describe('Caixas Controller Tests', function () {
    // Initialize global variables
    var CaixasController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CaixasService,
      mockCaixa;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CaixasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CaixasService = _CaixasService_;

      // create mock Caixa
      mockCaixa = new CaixasService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Caixa Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Caixas controller.
      CaixasController = $controller('CaixasController as vm', {
        $scope: $scope,
        caixaResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCaixaPostData;

      beforeEach(function () {
        // Create a sample Caixa object
        sampleCaixaPostData = new CaixasService({
          name: 'Caixa Name'
        });

        $scope.vm.caixa = sampleCaixaPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CaixasService) {
        // Set POST response
        $httpBackend.expectPOST('api/caixas', sampleCaixaPostData).respond(mockCaixa);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Caixa was created
        expect($state.go).toHaveBeenCalledWith('caixas.view', {
          caixaId: mockCaixa._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/caixas', sampleCaixaPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Caixa in $scope
        $scope.vm.caixa = mockCaixa;
      });

      it('should update a valid Caixa', inject(function (CaixasService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/caixas\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('caixas.view', {
          caixaId: mockCaixa._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CaixasService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/caixas\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Caixas
        $scope.vm.caixa = mockCaixa;
      });

      it('should delete the Caixa and redirect to Caixas', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/caixas\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('caixas.list');
      });

      it('should should not delete the Caixa and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
