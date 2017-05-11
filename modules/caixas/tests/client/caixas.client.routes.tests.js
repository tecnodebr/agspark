(function () {
  'use strict';

  describe('Caixas Route Tests', function () {
    // Initialize global variables
    var $scope,
      CaixasService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CaixasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CaixasService = _CaixasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('caixas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/caixas');
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
          CaixasController,
          mockCaixa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('caixas.view');
          $templateCache.put('modules/caixas/client/views/view-caixa.client.view.html', '');

          // create mock Caixa
          mockCaixa = new CaixasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Caixa Name'
          });

          //Initialize Controller
          CaixasController = $controller('CaixasController as vm', {
            $scope: $scope,
            caixaResolve: mockCaixa
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:caixaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.caixaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            caixaId: 1
          })).toEqual('/caixas/1');
        }));

        it('should attach an Caixa to the controller scope', function () {
          expect($scope.vm.caixa._id).toBe(mockCaixa._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/caixas/client/views/view-caixa.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CaixasController,
          mockCaixa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('caixas.create');
          $templateCache.put('modules/caixas/client/views/form-caixa.client.view.html', '');

          // create mock Caixa
          mockCaixa = new CaixasService();

          //Initialize Controller
          CaixasController = $controller('CaixasController as vm', {
            $scope: $scope,
            caixaResolve: mockCaixa
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.caixaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/caixas/create');
        }));

        it('should attach an Caixa to the controller scope', function () {
          expect($scope.vm.caixa._id).toBe(mockCaixa._id);
          expect($scope.vm.caixa._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/caixas/client/views/form-caixa.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CaixasController,
          mockCaixa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('caixas.edit');
          $templateCache.put('modules/caixas/client/views/form-caixa.client.view.html', '');

          // create mock Caixa
          mockCaixa = new CaixasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Caixa Name'
          });

          //Initialize Controller
          CaixasController = $controller('CaixasController as vm', {
            $scope: $scope,
            caixaResolve: mockCaixa
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:caixaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.caixaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            caixaId: 1
          })).toEqual('/caixas/1/edit');
        }));

        it('should attach an Caixa to the controller scope', function () {
          expect($scope.vm.caixa._id).toBe(mockCaixa._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/caixas/client/views/form-caixa.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
