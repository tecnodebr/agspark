'use strict';

describe('Configuracoes E2E Tests:', function () {
  describe('Test Configuracoes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/configuracoes');
      expect(element.all(by.repeater('configuraco in configuracoes')).count()).toEqual(0);
    });
  });
});
