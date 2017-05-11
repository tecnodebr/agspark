'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Faixapreco = mongoose.model('Faixapreco'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, faixapreco;

/**
 * Faixapreco routes tests
 */
describe('Faixapreco CRUD tests', function () {

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

    // Save a user to the test db and create new Faixapreco
    user.save(function () {
      faixapreco = {
        name: 'Faixapreco name'
      };

      done();
    });
  });

  it('should be able to save a Faixapreco if logged in', function (done) {
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

        // Save a new Faixapreco
        agent.post('/api/faixaprecos')
          .send(faixapreco)
          .expect(200)
          .end(function (faixaprecoSaveErr, faixaprecoSaveRes) {
            // Handle Faixapreco save error
            if (faixaprecoSaveErr) {
              return done(faixaprecoSaveErr);
            }

            // Get a list of Faixaprecos
            agent.get('/api/faixaprecos')
              .end(function (faixaprecosGetErr, faixaprecosGetRes) {
                // Handle Faixapreco save error
                if (faixaprecosGetErr) {
                  return done(faixaprecosGetErr);
                }

                // Get Faixaprecos list
                var faixaprecos = faixaprecosGetRes.body;

                // Set assertions
                (faixaprecos[0].user._id).should.equal(userId);
                (faixaprecos[0].name).should.match('Faixapreco name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Faixapreco if not logged in', function (done) {
    agent.post('/api/faixaprecos')
      .send(faixapreco)
      .expect(403)
      .end(function (faixaprecoSaveErr, faixaprecoSaveRes) {
        // Call the assertion callback
        done(faixaprecoSaveErr);
      });
  });

  it('should not be able to save an Faixapreco if no name is provided', function (done) {
    // Invalidate name field
    faixapreco.name = '';

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

        // Save a new Faixapreco
        agent.post('/api/faixaprecos')
          .send(faixapreco)
          .expect(400)
          .end(function (faixaprecoSaveErr, faixaprecoSaveRes) {
            // Set message assertion
            (faixaprecoSaveRes.body.message).should.match('Please fill Faixapreco name');

            // Handle Faixapreco save error
            done(faixaprecoSaveErr);
          });
      });
  });

  it('should be able to update an Faixapreco if signed in', function (done) {
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

        // Save a new Faixapreco
        agent.post('/api/faixaprecos')
          .send(faixapreco)
          .expect(200)
          .end(function (faixaprecoSaveErr, faixaprecoSaveRes) {
            // Handle Faixapreco save error
            if (faixaprecoSaveErr) {
              return done(faixaprecoSaveErr);
            }

            // Update Faixapreco name
            faixapreco.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Faixapreco
            agent.put('/api/faixaprecos/' + faixaprecoSaveRes.body._id)
              .send(faixapreco)
              .expect(200)
              .end(function (faixaprecoUpdateErr, faixaprecoUpdateRes) {
                // Handle Faixapreco update error
                if (faixaprecoUpdateErr) {
                  return done(faixaprecoUpdateErr);
                }

                // Set assertions
                (faixaprecoUpdateRes.body._id).should.equal(faixaprecoSaveRes.body._id);
                (faixaprecoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Faixaprecos if not signed in', function (done) {
    // Create new Faixapreco model instance
    var faixaprecoObj = new Faixapreco(faixapreco);

    // Save the faixapreco
    faixaprecoObj.save(function () {
      // Request Faixaprecos
      request(app).get('/api/faixaprecos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Faixapreco if not signed in', function (done) {
    // Create new Faixapreco model instance
    var faixaprecoObj = new Faixapreco(faixapreco);

    // Save the Faixapreco
    faixaprecoObj.save(function () {
      request(app).get('/api/faixaprecos/' + faixaprecoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', faixapreco.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Faixapreco with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/faixaprecos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Faixapreco is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Faixapreco which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Faixapreco
    request(app).get('/api/faixaprecos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Faixapreco with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Faixapreco if signed in', function (done) {
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

        // Save a new Faixapreco
        agent.post('/api/faixaprecos')
          .send(faixapreco)
          .expect(200)
          .end(function (faixaprecoSaveErr, faixaprecoSaveRes) {
            // Handle Faixapreco save error
            if (faixaprecoSaveErr) {
              return done(faixaprecoSaveErr);
            }

            // Delete an existing Faixapreco
            agent.delete('/api/faixaprecos/' + faixaprecoSaveRes.body._id)
              .send(faixapreco)
              .expect(200)
              .end(function (faixaprecoDeleteErr, faixaprecoDeleteRes) {
                // Handle faixapreco error error
                if (faixaprecoDeleteErr) {
                  return done(faixaprecoDeleteErr);
                }

                // Set assertions
                (faixaprecoDeleteRes.body._id).should.equal(faixaprecoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Faixapreco if not signed in', function (done) {
    // Set Faixapreco user
    faixapreco.user = user;

    // Create new Faixapreco model instance
    var faixaprecoObj = new Faixapreco(faixapreco);

    // Save the Faixapreco
    faixaprecoObj.save(function () {
      // Try deleting Faixapreco
      request(app).delete('/api/faixaprecos/' + faixaprecoObj._id)
        .expect(403)
        .end(function (faixaprecoDeleteErr, faixaprecoDeleteRes) {
          // Set message assertion
          (faixaprecoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Faixapreco error error
          done(faixaprecoDeleteErr);
        });

    });
  });

  it('should be able to get a single Faixapreco that has an orphaned user reference', function (done) {
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

          // Save a new Faixapreco
          agent.post('/api/faixaprecos')
            .send(faixapreco)
            .expect(200)
            .end(function (faixaprecoSaveErr, faixaprecoSaveRes) {
              // Handle Faixapreco save error
              if (faixaprecoSaveErr) {
                return done(faixaprecoSaveErr);
              }

              // Set assertions on new Faixapreco
              (faixaprecoSaveRes.body.name).should.equal(faixapreco.name);
              should.exist(faixaprecoSaveRes.body.user);
              should.equal(faixaprecoSaveRes.body.user._id, orphanId);

              // force the Faixapreco to have an orphaned user reference
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

                    // Get the Faixapreco
                    agent.get('/api/faixaprecos/' + faixaprecoSaveRes.body._id)
                      .expect(200)
                      .end(function (faixaprecoInfoErr, faixaprecoInfoRes) {
                        // Handle Faixapreco error
                        if (faixaprecoInfoErr) {
                          return done(faixaprecoInfoErr);
                        }

                        // Set assertions
                        (faixaprecoInfoRes.body._id).should.equal(faixaprecoSaveRes.body._id);
                        (faixaprecoInfoRes.body.name).should.equal(faixapreco.name);
                        should.equal(faixaprecoInfoRes.body.user, undefined);

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
      Faixapreco.remove().exec(done);
    });
  });
});
