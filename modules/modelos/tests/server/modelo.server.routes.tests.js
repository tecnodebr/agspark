'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Modelo = mongoose.model('Modelo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, modelo;

/**
 * Modelo routes tests
 */
describe('Modelo CRUD tests', function () {

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

    // Save a user to the test db and create new Modelo
    user.save(function () {
      modelo = {
        name: 'Modelo name'
      };

      done();
    });
  });

  it('should be able to save a Modelo if logged in', function (done) {
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

        // Save a new Modelo
        agent.post('/api/modelos')
          .send(modelo)
          .expect(200)
          .end(function (modeloSaveErr, modeloSaveRes) {
            // Handle Modelo save error
            if (modeloSaveErr) {
              return done(modeloSaveErr);
            }

            // Get a list of Modelos
            agent.get('/api/modelos')
              .end(function (modelosGetErr, modelosGetRes) {
                // Handle Modelo save error
                if (modelosGetErr) {
                  return done(modelosGetErr);
                }

                // Get Modelos list
                var modelos = modelosGetRes.body;

                // Set assertions
                (modelos[0].user._id).should.equal(userId);
                (modelos[0].name).should.match('Modelo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Modelo if not logged in', function (done) {
    agent.post('/api/modelos')
      .send(modelo)
      .expect(403)
      .end(function (modeloSaveErr, modeloSaveRes) {
        // Call the assertion callback
        done(modeloSaveErr);
      });
  });

  it('should not be able to save an Modelo if no name is provided', function (done) {
    // Invalidate name field
    modelo.name = '';

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

        // Save a new Modelo
        agent.post('/api/modelos')
          .send(modelo)
          .expect(400)
          .end(function (modeloSaveErr, modeloSaveRes) {
            // Set message assertion
            (modeloSaveRes.body.message).should.match('Please fill Modelo name');

            // Handle Modelo save error
            done(modeloSaveErr);
          });
      });
  });

  it('should be able to update an Modelo if signed in', function (done) {
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

        // Save a new Modelo
        agent.post('/api/modelos')
          .send(modelo)
          .expect(200)
          .end(function (modeloSaveErr, modeloSaveRes) {
            // Handle Modelo save error
            if (modeloSaveErr) {
              return done(modeloSaveErr);
            }

            // Update Modelo name
            modelo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Modelo
            agent.put('/api/modelos/' + modeloSaveRes.body._id)
              .send(modelo)
              .expect(200)
              .end(function (modeloUpdateErr, modeloUpdateRes) {
                // Handle Modelo update error
                if (modeloUpdateErr) {
                  return done(modeloUpdateErr);
                }

                // Set assertions
                (modeloUpdateRes.body._id).should.equal(modeloSaveRes.body._id);
                (modeloUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Modelos if not signed in', function (done) {
    // Create new Modelo model instance
    var modeloObj = new Modelo(modelo);

    // Save the modelo
    modeloObj.save(function () {
      // Request Modelos
      request(app).get('/api/modelos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Modelo if not signed in', function (done) {
    // Create new Modelo model instance
    var modeloObj = new Modelo(modelo);

    // Save the Modelo
    modeloObj.save(function () {
      request(app).get('/api/modelos/' + modeloObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', modelo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Modelo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/modelos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Modelo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Modelo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Modelo
    request(app).get('/api/modelos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Modelo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Modelo if signed in', function (done) {
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

        // Save a new Modelo
        agent.post('/api/modelos')
          .send(modelo)
          .expect(200)
          .end(function (modeloSaveErr, modeloSaveRes) {
            // Handle Modelo save error
            if (modeloSaveErr) {
              return done(modeloSaveErr);
            }

            // Delete an existing Modelo
            agent.delete('/api/modelos/' + modeloSaveRes.body._id)
              .send(modelo)
              .expect(200)
              .end(function (modeloDeleteErr, modeloDeleteRes) {
                // Handle modelo error error
                if (modeloDeleteErr) {
                  return done(modeloDeleteErr);
                }

                // Set assertions
                (modeloDeleteRes.body._id).should.equal(modeloSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Modelo if not signed in', function (done) {
    // Set Modelo user
    modelo.user = user;

    // Create new Modelo model instance
    var modeloObj = new Modelo(modelo);

    // Save the Modelo
    modeloObj.save(function () {
      // Try deleting Modelo
      request(app).delete('/api/modelos/' + modeloObj._id)
        .expect(403)
        .end(function (modeloDeleteErr, modeloDeleteRes) {
          // Set message assertion
          (modeloDeleteRes.body.message).should.match('User is not authorized');

          // Handle Modelo error error
          done(modeloDeleteErr);
        });

    });
  });

  it('should be able to get a single Modelo that has an orphaned user reference', function (done) {
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

          // Save a new Modelo
          agent.post('/api/modelos')
            .send(modelo)
            .expect(200)
            .end(function (modeloSaveErr, modeloSaveRes) {
              // Handle Modelo save error
              if (modeloSaveErr) {
                return done(modeloSaveErr);
              }

              // Set assertions on new Modelo
              (modeloSaveRes.body.name).should.equal(modelo.name);
              should.exist(modeloSaveRes.body.user);
              should.equal(modeloSaveRes.body.user._id, orphanId);

              // force the Modelo to have an orphaned user reference
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

                    // Get the Modelo
                    agent.get('/api/modelos/' + modeloSaveRes.body._id)
                      .expect(200)
                      .end(function (modeloInfoErr, modeloInfoRes) {
                        // Handle Modelo error
                        if (modeloInfoErr) {
                          return done(modeloInfoErr);
                        }

                        // Set assertions
                        (modeloInfoRes.body._id).should.equal(modeloSaveRes.body._id);
                        (modeloInfoRes.body.name).should.equal(modelo.name);
                        should.equal(modeloInfoRes.body.user, undefined);

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
      Modelo.remove().exec(done);
    });
  });
});
