'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Caixa = mongoose.model('Caixa'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, caixa;

/**
 * Caixa routes tests
 */
describe('Caixa CRUD tests', function () {

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

    // Save a user to the test db and create new Caixa
    user.save(function () {
      caixa = {
        name: 'Caixa name'
      };

      done();
    });
  });

  it('should be able to save a Caixa if logged in', function (done) {
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

        // Save a new Caixa
        agent.post('/api/caixas')
          .send(caixa)
          .expect(200)
          .end(function (caixaSaveErr, caixaSaveRes) {
            // Handle Caixa save error
            if (caixaSaveErr) {
              return done(caixaSaveErr);
            }

            // Get a list of Caixas
            agent.get('/api/caixas')
              .end(function (caixasGetErr, caixasGetRes) {
                // Handle Caixa save error
                if (caixasGetErr) {
                  return done(caixasGetErr);
                }

                // Get Caixas list
                var caixas = caixasGetRes.body;

                // Set assertions
                (caixas[0].user._id).should.equal(userId);
                (caixas[0].name).should.match('Caixa name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Caixa if not logged in', function (done) {
    agent.post('/api/caixas')
      .send(caixa)
      .expect(403)
      .end(function (caixaSaveErr, caixaSaveRes) {
        // Call the assertion callback
        done(caixaSaveErr);
      });
  });

  it('should not be able to save an Caixa if no name is provided', function (done) {
    // Invalidate name field
    caixa.name = '';

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

        // Save a new Caixa
        agent.post('/api/caixas')
          .send(caixa)
          .expect(400)
          .end(function (caixaSaveErr, caixaSaveRes) {
            // Set message assertion
            (caixaSaveRes.body.message).should.match('Please fill Caixa name');

            // Handle Caixa save error
            done(caixaSaveErr);
          });
      });
  });

  it('should be able to update an Caixa if signed in', function (done) {
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

        // Save a new Caixa
        agent.post('/api/caixas')
          .send(caixa)
          .expect(200)
          .end(function (caixaSaveErr, caixaSaveRes) {
            // Handle Caixa save error
            if (caixaSaveErr) {
              return done(caixaSaveErr);
            }

            // Update Caixa name
            caixa.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Caixa
            agent.put('/api/caixas/' + caixaSaveRes.body._id)
              .send(caixa)
              .expect(200)
              .end(function (caixaUpdateErr, caixaUpdateRes) {
                // Handle Caixa update error
                if (caixaUpdateErr) {
                  return done(caixaUpdateErr);
                }

                // Set assertions
                (caixaUpdateRes.body._id).should.equal(caixaSaveRes.body._id);
                (caixaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Caixas if not signed in', function (done) {
    // Create new Caixa model instance
    var caixaObj = new Caixa(caixa);

    // Save the caixa
    caixaObj.save(function () {
      // Request Caixas
      request(app).get('/api/caixas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Caixa if not signed in', function (done) {
    // Create new Caixa model instance
    var caixaObj = new Caixa(caixa);

    // Save the Caixa
    caixaObj.save(function () {
      request(app).get('/api/caixas/' + caixaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', caixa.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Caixa with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/caixas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Caixa is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Caixa which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Caixa
    request(app).get('/api/caixas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Caixa with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Caixa if signed in', function (done) {
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

        // Save a new Caixa
        agent.post('/api/caixas')
          .send(caixa)
          .expect(200)
          .end(function (caixaSaveErr, caixaSaveRes) {
            // Handle Caixa save error
            if (caixaSaveErr) {
              return done(caixaSaveErr);
            }

            // Delete an existing Caixa
            agent.delete('/api/caixas/' + caixaSaveRes.body._id)
              .send(caixa)
              .expect(200)
              .end(function (caixaDeleteErr, caixaDeleteRes) {
                // Handle caixa error error
                if (caixaDeleteErr) {
                  return done(caixaDeleteErr);
                }

                // Set assertions
                (caixaDeleteRes.body._id).should.equal(caixaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Caixa if not signed in', function (done) {
    // Set Caixa user
    caixa.user = user;

    // Create new Caixa model instance
    var caixaObj = new Caixa(caixa);

    // Save the Caixa
    caixaObj.save(function () {
      // Try deleting Caixa
      request(app).delete('/api/caixas/' + caixaObj._id)
        .expect(403)
        .end(function (caixaDeleteErr, caixaDeleteRes) {
          // Set message assertion
          (caixaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Caixa error error
          done(caixaDeleteErr);
        });

    });
  });

  it('should be able to get a single Caixa that has an orphaned user reference', function (done) {
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

          // Save a new Caixa
          agent.post('/api/caixas')
            .send(caixa)
            .expect(200)
            .end(function (caixaSaveErr, caixaSaveRes) {
              // Handle Caixa save error
              if (caixaSaveErr) {
                return done(caixaSaveErr);
              }

              // Set assertions on new Caixa
              (caixaSaveRes.body.name).should.equal(caixa.name);
              should.exist(caixaSaveRes.body.user);
              should.equal(caixaSaveRes.body.user._id, orphanId);

              // force the Caixa to have an orphaned user reference
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

                    // Get the Caixa
                    agent.get('/api/caixas/' + caixaSaveRes.body._id)
                      .expect(200)
                      .end(function (caixaInfoErr, caixaInfoRes) {
                        // Handle Caixa error
                        if (caixaInfoErr) {
                          return done(caixaInfoErr);
                        }

                        // Set assertions
                        (caixaInfoRes.body._id).should.equal(caixaSaveRes.body._id);
                        (caixaInfoRes.body.name).should.equal(caixa.name);
                        should.equal(caixaInfoRes.body.user, undefined);

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
      Caixa.remove().exec(done);
    });
  });
});
