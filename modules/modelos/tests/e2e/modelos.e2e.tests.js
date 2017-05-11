'use strict';

describe('Modelos E2E Tests:', function () {
  describe('Test Modelos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/modelos');
      expect(element.all(by.repeater('modelo in modelos')).count()).toEqual(0);
    });
  });
});
