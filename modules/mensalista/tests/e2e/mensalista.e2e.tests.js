'use strict';

describe('Mensalista E2E Tests:', function () {
  describe('Test Mensalista page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mensalista');
      expect(element.all(by.repeater('mensalista in mensalista')).count()).toEqual(0);
    });
  });
});
