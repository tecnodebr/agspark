(function () {
  'use strict';

  angular
  .module('entradaveiculos')
  .controller('EntradaveiculosListController', EntradaveiculosListController);

  EntradaveiculosListController.$inject = ['$scope', '$filter', 'EntradaveiculosService'];

  function EntradaveiculosListController($scope, $filter,EntradaveiculosService) {
    var vm = this;

    EntradaveiculosService.Entrada.query(function (data) {
      $scope.entradasveiculos = data;
    });


  }

})();
