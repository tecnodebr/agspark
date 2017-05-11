(function () {
  'use strict';

  describe('Tabelaprecos Route Tests', function () {
    // Initialize global variables
    var $scope,
      TabelaprecosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TabelaprecosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TabelaprecosService = _TabelaprecosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tabelaprecos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tabelaprecos');
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
          TabelaprecosController,
          mockTabelapreco;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tabelaprecos.view');
          $templateCache.put('modules/tabelaprecos/client/views/view-tabelapreco.client.view.html', '');

          // create mock Tabelapreco
          mockTabelapreco = new TabelaprecosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tabelapreco Name'
          });

          //Initialize Controller
          TabelaprecosController = $controller('TabelaprecosController as vm', {
            $scope: $scope,
            tabelaprecoResolve: mockTabelapreco
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tabelaprecoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tabelaprecoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tabelaprecoId: 1
          })).toEqual('/tabelaprecos/1');
        }));

        it('should attach an Tabelapreco to the controller scope', function () {
          expect($scope.vm.tabelapreco._id).toBe(mockTabelapreco._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tabelaprecos/client/views/view-tabelapreco.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TabelaprecosController,
          mockTabelapreco;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tabelaprecos.create');
          $templateCache.put('modules/tabelaprecos/client/views/form-tabelapreco.client.view.html', '');

          // create mock Tabelapreco
          mockTabelapreco = new TabelaprecosService();

          //Initialize Controller
          TabelaprecosController = $controller('TabelaprecosController as vm', {
            $scope: $scope,
            tabelaprecoResolve: mockTabelapreco
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tabelaprecoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tabelaprecos/create');
        }));

        it('should attach an Tabelapreco to the controller scope', function () {
          expect($scope.vm.tabelapreco._id).toBe(mockTabelapreco._id);
          expect($scope.vm.tabelapreco._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tabelaprecos/client/views/form-tabelapreco.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TabelaprecosController,
          mockTabelapreco;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tabelaprecos.edit');
          $templateCache.put('modules/tabelaprecos/client/views/form-tabelapreco.client.view.html', '');

          // create mock Tabelapreco
          mockTabelapreco = new TabelaprecosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tabelapreco Name'
          });

          //Initialize Controller
          TabelaprecosController = $controller('TabelaprecosController as vm', {
            $scope: $scope,
            tabelaprecoResolve: mockTabelapreco
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tabelaprecoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tabelaprecoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tabelaprecoId: 1
          })).toEqual('/tabelaprecos/1/edit');
        }));

        it('should attach an Tabelapreco to the controller scope', function () {
          expect($scope.vm.tabelapreco._id).toBe(mockTabelapreco._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tabelaprecos/client/views/form-tabelapreco.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
