(function () {
  'use strict';

  describe('Configuracoes Route Tests', function () {
    // Initialize global variables
    var $scope,
      ConfiguracoesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ConfiguracoesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ConfiguracoesService = _ConfiguracoesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('configuracoes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/configuracoes');
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
          ConfiguracoesController,
          mockConfiguraco;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('configuracoes.view');
          $templateCache.put('modules/configuracoes/client/views/view-configuraco.client.view.html', '');

          // create mock Configuraco
          mockConfiguraco = new ConfiguracoesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Configuraco Name'
          });

          //Initialize Controller
          ConfiguracoesController = $controller('ConfiguracoesController as vm', {
            $scope: $scope,
            configuracoResolve: mockConfiguraco
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:configuracoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.configuracoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            configuracoId: 1
          })).toEqual('/configuracoes/1');
        }));

        it('should attach an Configuraco to the controller scope', function () {
          expect($scope.vm.configuraco._id).toBe(mockConfiguraco._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/configuracoes/client/views/view-configuraco.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ConfiguracoesController,
          mockConfiguraco;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('configuracoes.create');
          $templateCache.put('modules/configuracoes/client/views/form-configuraco.client.view.html', '');

          // create mock Configuraco
          mockConfiguraco = new ConfiguracoesService();

          //Initialize Controller
          ConfiguracoesController = $controller('ConfiguracoesController as vm', {
            $scope: $scope,
            configuracoResolve: mockConfiguraco
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.configuracoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/configuracoes/create');
        }));

        it('should attach an Configuraco to the controller scope', function () {
          expect($scope.vm.configuraco._id).toBe(mockConfiguraco._id);
          expect($scope.vm.configuraco._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/configuracoes/client/views/form-configuraco.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ConfiguracoesController,
          mockConfiguraco;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('configuracoes.edit');
          $templateCache.put('modules/configuracoes/client/views/form-configuraco.client.view.html', '');

          // create mock Configuraco
          mockConfiguraco = new ConfiguracoesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Configuraco Name'
          });

          //Initialize Controller
          ConfiguracoesController = $controller('ConfiguracoesController as vm', {
            $scope: $scope,
            configuracoResolve: mockConfiguraco
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:configuracoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.configuracoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            configuracoId: 1
          })).toEqual('/configuracoes/1/edit');
        }));

        it('should attach an Configuraco to the controller scope', function () {
          expect($scope.vm.configuraco._id).toBe(mockConfiguraco._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/configuracoes/client/views/form-configuraco.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
