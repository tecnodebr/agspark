'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tabelapreco = mongoose.model('Tabelapreco'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, tabelapreco;

/**
 * Tabelapreco routes tests
 */
describe('Tabelapreco CRUD tests', function () {

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

    // Save a user to the test db and create new Tabelapreco
    user.save(function () {
      tabelapreco = {
        name: 'Tabelapreco name'
      };

      done();
    });
  });

  it('should be able to save a Tabelapreco if logged in', function (done) {
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

        // Save a new Tabelapreco
        agent.post('/api/tabelaprecos')
          .send(tabelapreco)
          .expect(200)
          .end(function (tabelaprecoSaveErr, tabelaprecoSaveRes) {
            // Handle Tabelapreco save error
            if (tabelaprecoSaveErr) {
              return done(tabelaprecoSaveErr);
            }

            // Get a list of Tabelaprecos
            agent.get('/api/tabelaprecos')
              .end(function (tabelaprecosGetErr, tabelaprecosGetRes) {
                // Handle Tabelapreco save error
                if (tabelaprecosGetErr) {
                  return done(tabelaprecosGetErr);
                }

                // Get Tabelaprecos list
                var tabelaprecos = tabelaprecosGetRes.body;

                // Set assertions
                (tabelaprecos[0].user._id).should.equal(userId);
                (tabelaprecos[0].name).should.match('Tabelapreco name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Tabelapreco if not logged in', function (done) {
    agent.post('/api/tabelaprecos')
      .send(tabelapreco)
      .expect(403)
      .end(function (tabelaprecoSaveErr, tabelaprecoSaveRes) {
        // Call the assertion callback
        done(tabelaprecoSaveErr);
      });
  });

  it('should not be able to save an Tabelapreco if no name is provided', function (done) {
    // Invalidate name field
    tabelapreco.name = '';

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

        // Save a new Tabelapreco
        agent.post('/api/tabelaprecos')
          .send(tabelapreco)
          .expect(400)
          .end(function (tabelaprecoSaveErr, tabelaprecoSaveRes) {
            // Set message assertion
            (tabelaprecoSaveRes.body.message).should.match('Please fill Tabelapreco name');

            // Handle Tabelapreco save error
            done(tabelaprecoSaveErr);
          });
      });
  });

  it('should be able to update an Tabelapreco if signed in', function (done) {
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

        // Save a new Tabelapreco
        agent.post('/api/tabelaprecos')
          .send(tabelapreco)
          .expect(200)
          .end(function (tabelaprecoSaveErr, tabelaprecoSaveRes) {
            // Handle Tabelapreco save error
            if (tabelaprecoSaveErr) {
              return done(tabelaprecoSaveErr);
            }

            // Update Tabelapreco name
            tabelapreco.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Tabelapreco
            agent.put('/api/tabelaprecos/' + tabelaprecoSaveRes.body._id)
              .send(tabelapreco)
              .expect(200)
              .end(function (tabelaprecoUpdateErr, tabelaprecoUpdateRes) {
                // Handle Tabelapreco update error
                if (tabelaprecoUpdateErr) {
                  return done(tabelaprecoUpdateErr);
                }

                // Set assertions
                (tabelaprecoUpdateRes.body._id).should.equal(tabelaprecoSaveRes.body._id);
                (tabelaprecoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tabelaprecos if not signed in', function (done) {
    // Create new Tabelapreco model instance
    var tabelaprecoObj = new Tabelapreco(tabelapreco);

    // Save the tabelapreco
    tabelaprecoObj.save(function () {
      // Request Tabelaprecos
      request(app).get('/api/tabelaprecos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Tabelapreco if not signed in', function (done) {
    // Create new Tabelapreco model instance
    var tabelaprecoObj = new Tabelapreco(tabelapreco);

    // Save the Tabelapreco
    tabelaprecoObj.save(function () {
      request(app).get('/api/tabelaprecos/' + tabelaprecoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', tabelapreco.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Tabelapreco with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tabelaprecos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tabelapreco is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Tabelapreco which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Tabelapreco
    request(app).get('/api/tabelaprecos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Tabelapreco with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Tabelapreco if signed in', function (done) {
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

        // Save a new Tabelapreco
        agent.post('/api/tabelaprecos')
          .send(tabelapreco)
          .expect(200)
          .end(function (tabelaprecoSaveErr, tabelaprecoSaveRes) {
            // Handle Tabelapreco save error
            if (tabelaprecoSaveErr) {
              return done(tabelaprecoSaveErr);
            }

            // Delete an existing Tabelapreco
            agent.delete('/api/tabelaprecos/' + tabelaprecoSaveRes.body._id)
              .send(tabelapreco)
              .expect(200)
              .end(function (tabelaprecoDeleteErr, tabelaprecoDeleteRes) {
                // Handle tabelapreco error error
                if (tabelaprecoDeleteErr) {
                  return done(tabelaprecoDeleteErr);
                }

                // Set assertions
                (tabelaprecoDeleteRes.body._id).should.equal(tabelaprecoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Tabelapreco if not signed in', function (done) {
    // Set Tabelapreco user
    tabelapreco.user = user;

    // Create new Tabelapreco model instance
    var tabelaprecoObj = new Tabelapreco(tabelapreco);

    // Save the Tabelapreco
    tabelaprecoObj.save(function () {
      // Try deleting Tabelapreco
      request(app).delete('/api/tabelaprecos/' + tabelaprecoObj._id)
        .expect(403)
        .end(function (tabelaprecoDeleteErr, tabelaprecoDeleteRes) {
          // Set message assertion
          (tabelaprecoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Tabelapreco error error
          done(tabelaprecoDeleteErr);
        });

    });
  });

  it('should be able to get a single Tabelapreco that has an orphaned user reference', function (done) {
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

          // Save a new Tabelapreco
          agent.post('/api/tabelaprecos')
            .send(tabelapreco)
            .expect(200)
            .end(function (tabelaprecoSaveErr, tabelaprecoSaveRes) {
              // Handle Tabelapreco save error
              if (tabelaprecoSaveErr) {
                return done(tabelaprecoSaveErr);
              }

              // Set assertions on new Tabelapreco
              (tabelaprecoSaveRes.body.name).should.equal(tabelapreco.name);
              should.exist(tabelaprecoSaveRes.body.user);
              should.equal(tabelaprecoSaveRes.body.user._id, orphanId);

              // force the Tabelapreco to have an orphaned user reference
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

                    // Get the Tabelapreco
                    agent.get('/api/tabelaprecos/' + tabelaprecoSaveRes.body._id)
                      .expect(200)
                      .end(function (tabelaprecoInfoErr, tabelaprecoInfoRes) {
                        // Handle Tabelapreco error
                        if (tabelaprecoInfoErr) {
                          return done(tabelaprecoInfoErr);
                        }

                        // Set assertions
                        (tabelaprecoInfoRes.body._id).should.equal(tabelaprecoSaveRes.body._id);
                        (tabelaprecoInfoRes.body.name).should.equal(tabelapreco.name);
                        should.equal(tabelaprecoInfoRes.body.user, undefined);

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
      Tabelapreco.remove().exec(done);
    });
  });
});
