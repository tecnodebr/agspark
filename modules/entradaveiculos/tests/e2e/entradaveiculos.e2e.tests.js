'use strict';

describe('Entradaveiculos E2E Tests:', function () {
  describe('Test Entradaveiculos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/entradaveiculos');
      expect(element.all(by.repeater('entradaveiculo in entradaveiculos')).count()).toEqual(0);
    });
  });
});
