'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Configuraco = mongoose.model('Configuraco'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, configuraco;

/**
 * Configuraco routes tests
 */
describe('Configuraco CRUD tests', function () {

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

    // Save a user to the test db and create new Configuraco
    user.save(function () {
      configuraco = {
        name: 'Configuraco name'
      };

      done();
    });
  });

  it('should be able to save a Configuraco if logged in', function (done) {
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

        // Save a new Configuraco
        agent.post('/api/configuracoes')
          .send(configuraco)
          .expect(200)
          .end(function (configuracoSaveErr, configuracoSaveRes) {
            // Handle Configuraco save error
            if (configuracoSaveErr) {
              return done(configuracoSaveErr);
            }

            // Get a list of Configuracoes
            agent.get('/api/configuracoes')
              .end(function (configuracosGetErr, configuracosGetRes) {
                // Handle Configuraco save error
                if (configuracosGetErr) {
                  return done(configuracosGetErr);
                }

                // Get Configuracoes list
                //var configuracoes = configuracoesGetRes.body;

                // Set assertions
                //(configuracoes[0].user._id).should.equal(userId);
                //(configuracoes[0].name).should.match('Configuraco name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Configuraco if not logged in', function (done) {
    agent.post('/api/configuracoes')
      .send(configuraco)
      .expect(403)
      .end(function (configuracoSaveErr, configuracoSaveRes) {
        // Call the assertion callback
        done(configuracoSaveErr);
      });
  });

  it('should not be able to save an Configuraco if no name is provided', function (done) {
    // Invalidate name field
    configuraco.name = '';

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

        // Save a new Configuraco
        agent.post('/api/configuracoes')
          .send(configuraco)
          .expect(400)
          .end(function (configuracoSaveErr, configuracoSaveRes) {
            // Set message assertion
            (configuracoSaveRes.body.message).should.match('Please fill Configuraco name');

            // Handle Configuraco save error
            done(configuracoSaveErr);
          });
      });
  });

  it('should be able to update an Configuraco if signed in', function (done) {
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

        // Save a new Configuraco
        agent.post('/api/configuracoes')
          .send(configuraco)
          .expect(200)
          .end(function (configuracoSaveErr, configuracoSaveRes) {
            // Handle Configuraco save error
            if (configuracoSaveErr) {
              return done(configuracoSaveErr);
            }

            // Update Configuraco name
            configuraco.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Configuraco
            agent.put('/api/configuracoes/' + configuracoSaveRes.body._id)
              .send(configuraco)
              .expect(200)
              .end(function (configuracoUpdateErr, configuracoUpdateRes) {
                // Handle Configuraco update error
                if (configuracoUpdateErr) {
                  return done(configuracoUpdateErr);
                }

                // Set assertions
                (configuracoUpdateRes.body._id).should.equal(configuracoSaveRes.body._id);
                (configuracoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Configuracoes if not signed in', function (done) {
    // Create new Configuraco model instance
    var configuracoObj = new Configuraco(configuraco);

    // Save the configuraco
    configuracoObj.save(function () {
      // Request Configuracoes
      request(app).get('/api/configuracoes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Configuraco if not signed in', function (done) {
    // Create new Configuraco model instance
    var configuracoObj = new Configuraco(configuraco);

    // Save the Configuraco
    configuracoObj.save(function () {
      request(app).get('/api/configuracoes/' + configuracoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', configuraco.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Configuraco with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/configuracoes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Configuraco is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Configuraco which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Configuraco
    request(app).get('/api/configuracoes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Configuraco with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Configuraco if signed in', function (done) {
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

        // Save a new Configuraco
        agent.post('/api/configuracoes')
          .send(configuraco)
          .expect(200)
          .end(function (configuracoSaveErr, configuracoSaveRes) {
            // Handle Configuraco save error
            if (configuracoSaveErr) {
              return done(configuracoSaveErr);
            }

            // Delete an existing Configuraco
            agent.delete('/api/configuracoes/' + configuracoSaveRes.body._id)
              .send(configuraco)
              .expect(200)
              .end(function (configuracoDeleteErr, configuracoDeleteRes) {
                // Handle configuraco error error
                if (configuracoDeleteErr) {
                  return done(configuracoDeleteErr);
                }

                // Set assertions
                (configuracoDeleteRes.body._id).should.equal(configuracoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Configuraco if not signed in', function (done) {
    // Set Configuraco user
    configuraco.user = user;

    // Create new Configuraco model instance
    var configuracoObj = new Configuraco(configuraco);

    // Save the Configuraco
    configuracoObj.save(function () {
      // Try deleting Configuraco
      request(app).delete('/api/configuracoes/' + configuracoObj._id)
        .expect(403)
        .end(function (configuracoDeleteErr, configuracoDeleteRes) {
          // Set message assertion
          (configuracoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Configuraco error error
          done(configuracoDeleteErr);
        });

    });
  });

  it('should be able to get a single Configuraco that has an orphaned user reference', function (done) {
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

          // Save a new Configuraco
          agent.post('/api/configuracoes')
            .send(configuraco)
            .expect(200)
            .end(function (configuracoSaveErr, configuracoSaveRes) {
              // Handle Configuraco save error
              if (configuracoSaveErr) {
                return done(configuracoSaveErr);
              }

              // Set assertions on new Configuraco
              (configuracoSaveRes.body.name).should.equal(configuraco.name);
              should.exist(configuracoSaveRes.body.user);
              should.equal(configuracoSaveRes.body.user._id, orphanId);

              // force the Configuraco to have an orphaned user reference
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

                    // Get the Configuraco
                    agent.get('/api/configuracoes/' + configuracoSaveRes.body._id)
                      .expect(200)
                      .end(function (configuracoInfoErr, configuracoInfoRes) {
                        // Handle Configuraco error
                        if (configuracoInfoErr) {
                          return done(configuracoInfoErr);
                        }

                        // Set assertions
                        (configuracoInfoRes.body._id).should.equal(configuracoSaveRes.body._id);
                        (configuracoInfoRes.body.name).should.equal(configuraco.name);
                        should.equal(configuracoInfoRes.body.user, undefined);

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
      Configuraco.remove().exec(done);
    });
  });
});
