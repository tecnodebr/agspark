(function () {
  'use strict';

  describe('Mensalista Route Tests', function () {
    // Initialize global variables
    var $scope,
      MensalistaService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MensalistaService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MensalistaService = _MensalistaService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mensalista');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mensalista');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MensalistaController,
          mockMensalista;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mensalista.view');
          $templateCache.put('modules/mensalista/client/views/view-mensalista.client.view.html', '');

          // create mock Mensalista
          mockMensalista = new MensalistaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mensalista Name'
          });

          //Initialize Controller
          MensalistaController = $controller('MensalistaController as vm', {
            $scope: $scope,
            mensalistaResolve: mockMensalista
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mensalistaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mensalistaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mensalistaId: 1
          })).toEqual('/mensalista/1');
        }));

        it('should attach an Mensalista to the controller scope', function () {
          expect($scope.vm.mensalista._id).toBe(mockMensalista._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mensalista/client/views/view-mensalista.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MensalistaController,
          mockMensalista;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mensalista.create');
          $templateCache.put('modules/mensalista/client/views/form-mensalista.client.view.html', '');

          // create mock Mensalista
          mockMensalista = new MensalistaService();

          //Initialize Controller
          MensalistaController = $controller('MensalistaController as vm', {
            $scope: $scope,
            mensalistaResolve: mockMensalista
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mensalistaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mensalista/create');
        }));

        it('should attach an Mensalista to the controller scope', function () {
          expect($scope.vm.mensalista._id).toBe(mockMensalista._id);
          expect($scope.vm.mensalista._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mensalista/client/views/form-mensalista.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MensalistaController,
          mockMensalista;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mensalista.edit');
          $templateCache.put('modules/mensalista/client/views/form-mensalista.client.view.html', '');

          // create mock Mensalista
          mockMensalista = new MensalistaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mensalista Name'
          });

          //Initialize Controller
          MensalistaController = $controller('MensalistaController as vm', {
            $scope: $scope,
            mensalistaResolve: mockMensalista
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mensalistaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mensalistaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mensalistaId: 1
          })).toEqual('/mensalista/1/edit');
        }));

        it('should attach an Mensalista to the controller scope', function () {
          expect($scope.vm.mensalista._id).toBe(mockMensalista._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mensalista/client/views/form-mensalista.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
