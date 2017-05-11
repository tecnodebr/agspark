'use strict';

describe('Tabelaprecos E2E Tests:', function () {
  describe('Test Tabelaprecos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tabelaprecos');
      expect(element.all(by.repeater('tabelapreco in tabelaprecos')).count()).toEqual(0);
    });
  });
});
