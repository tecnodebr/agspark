'use strict';

describe('Faixaprecos E2E Tests:', function () {
  describe('Test Faixaprecos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/faixaprecos');
      expect(element.all(by.repeater('faixapreco in faixaprecos')).count()).toEqual(0);
    });
  });
});
