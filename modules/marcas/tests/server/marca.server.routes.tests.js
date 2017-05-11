'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Marca = mongoose.model('Marca'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, marca;

/**
 * Marca routes tests
 */
describe('Marca CRUD tests', function () {

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

    // Save a user to the test db and create new Marca
    user.save(function () {
      marca = {
        name: 'Marca name'
      };

      done();
    });
  });

  it('should be able to save a Marca if logged in', function (done) {
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

        // Save a new Marca
        agent.post('/api/marcas')
          .send(marca)
          .expect(200)
          .end(function (marcaSaveErr, marcaSaveRes) {
            // Handle Marca save error
            if (marcaSaveErr) {
              return done(marcaSaveErr);
            }

            // Get a list of Marcas
            agent.get('/api/marcas')
              .end(function (marcasGetErr, marcasGetRes) {
                // Handle Marca save error
                if (marcasGetErr) {
                  return done(marcasGetErr);
                }

                // Get Marcas list
                var marcas = marcasGetRes.body;

                // Set assertions
                (marcas[0].user._id).should.equal(userId);
                (marcas[0].name).should.match('Marca name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Marca if not logged in', function (done) {
    agent.post('/api/marcas')
      .send(marca)
      .expect(403)
      .end(function (marcaSaveErr, marcaSaveRes) {
        // Call the assertion callback
        done(marcaSaveErr);
      });
  });

  it('should not be able to save an Marca if no name is provided', function (done) {
    // Invalidate name field
    marca.name = '';

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

        // Save a new Marca
        agent.post('/api/marcas')
          .send(marca)
          .expect(400)
          .end(function (marcaSaveErr, marcaSaveRes) {
            // Set message assertion
            (marcaSaveRes.body.message).should.match('Please fill Marca name');

            // Handle Marca save error
            done(marcaSaveErr);
          });
      });
  });

  it('should be able to update an Marca if signed in', function (done) {
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

        // Save a new Marca
        agent.post('/api/marcas')
          .send(marca)
          .expect(200)
          .end(function (marcaSaveErr, marcaSaveRes) {
            // Handle Marca save error
            if (marcaSaveErr) {
              return done(marcaSaveErr);
            }

            // Update Marca name
            marca.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Marca
            agent.put('/api/marcas/' + marcaSaveRes.body._id)
              .send(marca)
              .expect(200)
              .end(function (marcaUpdateErr, marcaUpdateRes) {
                // Handle Marca update error
                if (marcaUpdateErr) {
                  return done(marcaUpdateErr);
                }

                // Set assertions
                (marcaUpdateRes.body._id).should.equal(marcaSaveRes.body._id);
                (marcaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Marcas if not signed in', function (done) {
    // Create new Marca model instance
    var marcaObj = new Marca(marca);

    // Save the marca
    marcaObj.save(function () {
      // Request Marcas
      request(app).get('/api/marcas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Marca if not signed in', function (done) {
    // Create new Marca model instance
    var marcaObj = new Marca(marca);

    // Save the Marca
    marcaObj.save(function () {
      request(app).get('/api/marcas/' + marcaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', marca.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Marca with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/marcas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Marca is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Marca which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Marca
    request(app).get('/api/marcas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Marca with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Marca if signed in', function (done) {
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

        // Save a new Marca
        agent.post('/api/marcas')
          .send(marca)
          .expect(200)
          .end(function (marcaSaveErr, marcaSaveRes) {
            // Handle Marca save error
            if (marcaSaveErr) {
              return done(marcaSaveErr);
            }

            // Delete an existing Marca
            agent.delete('/api/marcas/' + marcaSaveRes.body._id)
              .send(marca)
              .expect(200)
              .end(function (marcaDeleteErr, marcaDeleteRes) {
                // Handle marca error error
                if (marcaDeleteErr) {
                  return done(marcaDeleteErr);
                }

                // Set assertions
                (marcaDeleteRes.body._id).should.equal(marcaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Marca if not signed in', function (done) {
    // Set Marca user
    marca.user = user;

    // Create new Marca model instance
    var marcaObj = new Marca(marca);

    // Save the Marca
    marcaObj.save(function () {
      // Try deleting Marca
      request(app).delete('/api/marcas/' + marcaObj._id)
        .expect(403)
        .end(function (marcaDeleteErr, marcaDeleteRes) {
          // Set message assertion
          (marcaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Marca error error
          done(marcaDeleteErr);
        });

    });
  });

  it('should be able to get a single Marca that has an orphaned user reference', function (done) {
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

          // Save a new Marca
          agent.post('/api/marcas')
            .send(marca)
            .expect(200)
            .end(function (marcaSaveErr, marcaSaveRes) {
              // Handle Marca save error
              if (marcaSaveErr) {
                return done(marcaSaveErr);
              }

              // Set assertions on new Marca
              (marcaSaveRes.body.name).should.equal(marca.name);
              should.exist(marcaSaveRes.body.user);
              should.equal(marcaSaveRes.body.user._id, orphanId);

              // force the Marca to have an orphaned user reference
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

                    // Get the Marca
                    agent.get('/api/marcas/' + marcaSaveRes.body._id)
                      .expect(200)
                      .end(function (marcaInfoErr, marcaInfoRes) {
                        // Handle Marca error
                        if (marcaInfoErr) {
                          return done(marcaInfoErr);
                        }

                        // Set assertions
                        (marcaInfoRes.body._id).should.equal(marcaSaveRes.body._id);
                        (marcaInfoRes.body.name).should.equal(marca.name);
                        should.equal(marcaInfoRes.body.user, undefined);

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
      Marca.remove().exec(done);
    });
  });
});
