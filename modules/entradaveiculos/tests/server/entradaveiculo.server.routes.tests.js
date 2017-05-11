'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Entradaveiculo = mongoose.model('Entradaveiculo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, entradaveiculo;

/**
 * Entradaveiculo routes tests
 */
describe('Entradaveiculo CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Entradaveiculo
    user.save(function () {
      entradaveiculo = {
        name: 'Entradaveiculo name'
      };

      done();
    });
  });

  it('should be able to save a Entradaveiculo if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Entradaveiculo
        agent.post('/api/entradaveiculos')
          .send(entradaveiculo)
          .expect(200)
          .end(function (entradaveiculoSaveErr, entradaveiculoSaveRes) {
            // Handle Entradaveiculo save error
            if (entradaveiculoSaveErr) {
              return done(entradaveiculoSaveErr);
            }

            // Get a list of Entradaveiculos
            agent.get('/api/entradaveiculos')
              .end(function (entradaveiculosGetErr, entradaveiculosGetRes) {
                // Handle Entradaveiculo save error
                if (entradaveiculosGetErr) {
                  return done(entradaveiculosGetErr);
                }

                // Get Entradaveiculos list
                var entradaveiculos = entradaveiculosGetRes.body;

                // Set assertions
                (entradaveiculos[0].user._id).should.equal(userId);
                (entradaveiculos[0].name).should.match('Entradaveiculo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Entradaveiculo if not logged in', function (done) {
    agent.post('/api/entradaveiculos')
      .send(entradaveiculo)
      .expect(403)
      .end(function (entradaveiculoSaveErr, entradaveiculoSaveRes) {
        // Call the assertion callback
        done(entradaveiculoSaveErr);
      });
  });

  it('should not be able to save an Entradaveiculo if no name is provided', function (done) {
    // Invalidate name field
    entradaveiculo.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Entradaveiculo
        agent.post('/api/entradaveiculos')
          .send(entradaveiculo)
          .expect(400)
          .end(function (entradaveiculoSaveErr, entradaveiculoSaveRes) {
            // Set message assertion
            (entradaveiculoSaveRes.body.message).should.match('Please fill Entradaveiculo name');

            // Handle Entradaveiculo save error
            done(entradaveiculoSaveErr);
          });
      });
  });

  it('should be able to update an Entradaveiculo if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Entradaveiculo
        agent.post('/api/entradaveiculos')
          .send(entradaveiculo)
          .expect(200)
          .end(function (entradaveiculoSaveErr, entradaveiculoSaveRes) {
            // Handle Entradaveiculo save error
            if (entradaveiculoSaveErr) {
              return done(entradaveiculoSaveErr);
            }

            // Update Entradaveiculo name
            entradaveiculo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Entradaveiculo
            agent.put('/api/entradaveiculos/' + entradaveiculoSaveRes.body._id)
              .send(entradaveiculo)
              .expect(200)
              .end(function (entradaveiculoUpdateErr, entradaveiculoUpdateRes) {
                // Handle Entradaveiculo update error
                if (entradaveiculoUpdateErr) {
                  return done(entradaveiculoUpdateErr);
                }

                // Set assertions
                (entradaveiculoUpdateRes.body._id).should.equal(entradaveiculoSaveRes.body._id);
                (entradaveiculoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Entradaveiculos if not signed in', function (done) {
    // Create new Entradaveiculo model instance
    var entradaveiculoObj = new Entradaveiculo(entradaveiculo);

    // Save the entradaveiculo
    entradaveiculoObj.save(function () {
      // Request Entradaveiculos
      request(app).get('/api/entradaveiculos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Entradaveiculo if not signed in', function (done) {
    // Create new Entradaveiculo model instance
    var entradaveiculoObj = new Entradaveiculo(entradaveiculo);

    // Save the Entradaveiculo
    entradaveiculoObj.save(function () {
      request(app).get('/api/entradaveiculos/' + entradaveiculoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', entradaveiculo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Entradaveiculo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/entradaveiculos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Entradaveiculo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Entradaveiculo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Entradaveiculo
    request(app).get('/api/entradaveiculos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Entradaveiculo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Entradaveiculo if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Entradaveiculo
        agent.post('/api/entradaveiculos')
          .send(entradaveiculo)
          .expect(200)
          .end(function (entradaveiculoSaveErr, entradaveiculoSaveRes) {
            // Handle Entradaveiculo save error
            if (entradaveiculoSaveErr) {
              return done(entradaveiculoSaveErr);
            }

            // Delete an existing Entradaveiculo
            agent.delete('/api/entradaveiculos/' + entradaveiculoSaveRes.body._id)
              .send(entradaveiculo)
              .expect(200)
              .end(function (entradaveiculoDeleteErr, entradaveiculoDeleteRes) {
                // Handle entradaveiculo error error
                if (entradaveiculoDeleteErr) {
                  return done(entradaveiculoDeleteErr);
                }

                // Set assertions
                (entradaveiculoDeleteRes.body._id).should.equal(entradaveiculoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Entradaveiculo if not signed in', function (done) {
    // Set Entradaveiculo user
    entradaveiculo.user = user;

    // Create new Entradaveiculo model instance
    var entradaveiculoObj = new Entradaveiculo(entradaveiculo);

    // Save the Entradaveiculo
    entradaveiculoObj.save(function () {
      // Try deleting Entradaveiculo
      request(app).delete('/api/entradaveiculos/' + entradaveiculoObj._id)
        .expect(403)
        .end(function (entradaveiculoDeleteErr, entradaveiculoDeleteRes) {
          // Set message assertion
          (entradaveiculoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Entradaveiculo error error
          done(entradaveiculoDeleteErr);
        });

    });
  });

  it('should be able to get a single Entradaveiculo that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Entradaveiculo
          agent.post('/api/entradaveiculos')
            .send(entradaveiculo)
            .expect(200)
            .end(function (entradaveiculoSaveErr, entradaveiculoSaveRes) {
              // Handle Entradaveiculo save error
              if (entradaveiculoSaveErr) {
                return done(entradaveiculoSaveErr);
              }

              // Set assertions on new Entradaveiculo
              (entradaveiculoSaveRes.body.name).should.equal(entradaveiculo.name);
              should.exist(entradaveiculoSaveRes.body.user);
              should.equal(entradaveiculoSaveRes.body.user._id, orphanId);

              // force the Entradaveiculo to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Entradaveiculo
                    agent.get('/api/entradaveiculos/' + entradaveiculoSaveRes.body._id)
                      .expect(200)
                      .end(function (entradaveiculoInfoErr, entradaveiculoInfoRes) {
                        // Handle Entradaveiculo error
                        if (entradaveiculoInfoErr) {
                          return done(entradaveiculoInfoErr);
                        }

                        // Set assertions
                        (entradaveiculoInfoRes.body._id).should.equal(entradaveiculoSaveRes.body._id);
                        (entradaveiculoInfoRes.body.name).should.equal(entradaveiculo.name);
                        should.equal(entradaveiculoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Entradaveiculo.remove().exec(done);
    });
  });
});
