(function () {
  'use strict';

  describe('Entradaveiculos Route Tests', function () {
    // Initialize global variables
    var $scope,
      EntradaveiculosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EntradaveiculosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EntradaveiculosService = _EntradaveiculosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('entradaveiculos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/entradaveiculos');
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
          EntradaveiculosController,
          mockEntradaveiculo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('entradaveiculos.view');
          $templateCache.put('modules/entradaveiculos/client/views/view-entradaveiculo.client.view.html', '');

          // create mock Entradaveiculo
          mockEntradaveiculo = new EntradaveiculosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Entradaveiculo Name'
          });

          //Initialize Controller
          EntradaveiculosController = $controller('EntradaveiculosController as vm', {
            $scope: $scope,
            entradaveiculoResolve: mockEntradaveiculo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:entradaveiculoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.entradaveiculoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            entradaveiculoId: 1
          })).toEqual('/entradaveiculos/1');
        }));

        it('should attach an Entradaveiculo to the controller scope', function () {
          expect($scope.vm.entradaveiculo._id).toBe(mockEntradaveiculo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/entradaveiculos/client/views/view-entradaveiculo.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EntradaveiculosController,
          mockEntradaveiculo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('entradaveiculos.create');
          $templateCache.put('modules/entradaveiculos/client/views/form-entradaveiculo.client.view.html', '');

          // create mock Entradaveiculo
          mockEntradaveiculo = new EntradaveiculosService();

          //Initialize Controller
          EntradaveiculosController = $controller('EntradaveiculosController as vm', {
            $scope: $scope,
            entradaveiculoResolve: mockEntradaveiculo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.entradaveiculoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/entradaveiculos/create');
        }));

        it('should attach an Entradaveiculo to the controller scope', function () {
          expect($scope.vm.entradaveiculo._id).toBe(mockEntradaveiculo._id);
          expect($scope.vm.entradaveiculo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/entradaveiculos/client/views/form-entradaveiculo.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EntradaveiculosController,
          mockEntradaveiculo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('entradaveiculos.edit');
          $templateCache.put('modules/entradaveiculos/client/views/form-entradaveiculo.client.view.html', '');

          // create mock Entradaveiculo
          mockEntradaveiculo = new EntradaveiculosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Entradaveiculo Name'
          });

          //Initialize Controller
          EntradaveiculosController = $controller('EntradaveiculosController as vm', {
            $scope: $scope,
            entradaveiculoResolve: mockEntradaveiculo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:entradaveiculoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.entradaveiculoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            entradaveiculoId: 1
          })).toEqual('/entradaveiculos/1/edit');
        }));

        it('should attach an Entradaveiculo to the controller scope', function () {
          expect($scope.vm.entradaveiculo._id).toBe(mockEntradaveiculo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/entradaveiculos/client/views/form-entradaveiculo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
