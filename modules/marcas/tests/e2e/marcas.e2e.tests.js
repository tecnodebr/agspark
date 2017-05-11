'use strict';

describe('Marcas E2E Tests:', function () {
  describe('Test Marcas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/marcas');
      expect(element.all(by.repeater('marca in marcas')).count()).toEqual(0);
    });
  });
});
