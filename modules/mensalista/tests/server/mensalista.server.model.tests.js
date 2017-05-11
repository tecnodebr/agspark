'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mensalista = mongoose.model('Mensalista');

/**
 * Globals
 */
var user, mensalista;

/**
 * Unit tests
 */
describe('Mensalista Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      mensalista = new Mensalista({
        name: 'Mensalista Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return mensalista.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      mensalista.name = '';

      return mensalista.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Mensalista.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
