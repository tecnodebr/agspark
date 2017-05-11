(function () {
  'use strict';

  describe('Modelos Route Tests', function () {
    // Initialize global variables
    var $scope,
      ModelosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ModelosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ModelosService = _ModelosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('modelos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/modelos');
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
          ModelosController,
          mockModelo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('modelos.view');
          $templateCache.put('modules/modelos/client/views/view-modelo.client.view.html', '');

          // create mock Modelo
          mockModelo = new ModelosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Modelo Name'
          });

          //Initialize Controller
          ModelosController = $controller('ModelosController as vm', {
            $scope: $scope,
            modeloResolve: mockModelo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:modeloId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.modeloResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            modeloId: 1
          })).toEqual('/modelos/1');
        }));

        it('should attach an Modelo to the controller scope', function () {
          expect($scope.vm.modelo._id).toBe(mockModelo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/modelos/client/views/view-modelo.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ModelosController,
          mockModelo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('modelos.create');
          $templateCache.put('modules/modelos/client/views/form-modelo.client.view.html', '');

          // create mock Modelo
          mockModelo = new ModelosService();

          //Initialize Controller
          ModelosController = $controller('ModelosController as vm', {
            $scope: $scope,
            modeloResolve: mockModelo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.modeloResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/modelos/create');
        }));

        it('should attach an Modelo to the controller scope', function () {
          expect($scope.vm.modelo._id).toBe(mockModelo._id);
          expect($scope.vm.modelo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/modelos/client/views/form-modelo.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ModelosController,
          mockModelo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('modelos.edit');
          $templateCache.put('modules/modelos/client/views/form-modelo.client.view.html', '');

          // create mock Modelo
          mockModelo = new ModelosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Modelo Name'
          });

          //Initialize Controller
          ModelosController = $controller('ModelosController as vm', {
            $scope: $scope,
            modeloResolve: mockModelo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:modeloId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.modeloResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            modeloId: 1
          })).toEqual('/modelos/1/edit');
        }));

        it('should attach an Modelo to the controller scope', function () {
          expect($scope.vm.modelo._id).toBe(mockModelo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/modelos/client/views/form-modelo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
