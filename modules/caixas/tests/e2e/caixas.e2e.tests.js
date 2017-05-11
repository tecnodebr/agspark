'use strict';

describe('Caixas E2E Tests:', function () {
  describe('Test Caixas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/caixas');
      expect(element.all(by.repeater('caixa in caixas')).count()).toEqual(0);
    });
  });
});
