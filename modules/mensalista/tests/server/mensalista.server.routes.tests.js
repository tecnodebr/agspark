'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mensalista = mongoose.model('Mensalista'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, mensalista;

/**
 * Mensalista routes tests
 */
describe('Mensalista CRUD tests', function () {

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

    // Save a user to the test db and create new Mensalista
    user.save(function () {
      mensalista = {
        name: 'Mensalista name'
      };

      done();
    });
  });

  it('should be able to save a Mensalista if logged in', function (done) {
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

        // Save a new Mensalista
        agent.post('/api/mensalista')
          .send(mensalista)
          .expect(200)
          .end(function (mensalistaSaveErr, mensalistaSaveRes) {
            // Handle Mensalista save error
            if (mensalistaSaveErr) {
              return done(mensalistaSaveErr);
            }

            // Get a list of Mensalista
            agent.get('/api/mensalista')
              .end(function (mensalistasGetErr, mensalistasGetRes) {
                // Handle Mensalista save error
                if (mensalistasGetErr) {
                  return done(mensalistasGetErr);
                }

                // Get Mensalista list
                var mensalista = mensalistaGetRes.body;

                // Set assertions
                (mensalista[0].user._id).should.equal(userId);
                (mensalista[0].name).should.match('Mensalista name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mensalista if not logged in', function (done) {
    agent.post('/api/mensalista')
      .send(mensalista)
      .expect(403)
      .end(function (mensalistaSaveErr, mensalistaSaveRes) {
        // Call the assertion callback
        done(mensalistaSaveErr);
      });
  });

  it('should not be able to save an Mensalista if no name is provided', function (done) {
    // Invalidate name field
    mensalista.name = '';

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

        // Save a new Mensalista
        agent.post('/api/mensalista')
          .send(mensalista)
          .expect(400)
          .end(function (mensalistaSaveErr, mensalistaSaveRes) {
            // Set message assertion
            (mensalistaSaveRes.body.message).should.match('Please fill Mensalista name');

            // Handle Mensalista save error
            done(mensalistaSaveErr);
          });
      });
  });

  it('should be able to update an Mensalista if signed in', function (done) {
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

        // Save a new Mensalista
        agent.post('/api/mensalista')
          .send(mensalista)
          .expect(200)
          .end(function (mensalistaSaveErr, mensalistaSaveRes) {
            // Handle Mensalista save error
            if (mensalistaSaveErr) {
              return done(mensalistaSaveErr);
            }

            // Update Mensalista name
            mensalista.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mensalista
            agent.put('/api/mensalista/' + mensalistaSaveRes.body._id)
              .send(mensalista)
              .expect(200)
              .end(function (mensalistaUpdateErr, mensalistaUpdateRes) {
                // Handle Mensalista update error
                if (mensalistaUpdateErr) {
                  return done(mensalistaUpdateErr);
                }

                // Set assertions
                (mensalistaUpdateRes.body._id).should.equal(mensalistaSaveRes.body._id);
                (mensalistaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mensalista if not signed in', function (done) {
    // Create new Mensalista model instance
    var mensalistaObj = new Mensalista(mensalista);

    // Save the mensalista
    mensalistaObj.save(function () {
      // Request Mensalista
      request(app).get('/api/mensalista')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mensalista if not signed in', function (done) {
    // Create new Mensalista model instance
    var mensalistaObj = new Mensalista(mensalista);

    // Save the Mensalista
    mensalistaObj.save(function () {
      request(app).get('/api/mensalista/' + mensalistaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', mensalista.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mensalista with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mensalista/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mensalista is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mensalista which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mensalista
    request(app).get('/api/mensalista/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mensalista with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mensalista if signed in', function (done) {
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

        // Save a new Mensalista
        agent.post('/api/mensalista')
          .send(mensalista)
          .expect(200)
          .end(function (mensalistaSaveErr, mensalistaSaveRes) {
            // Handle Mensalista save error
            if (mensalistaSaveErr) {
              return done(mensalistaSaveErr);
            }

            // Delete an existing Mensalista
            agent.delete('/api/mensalista/' + mensalistaSaveRes.body._id)
              .send(mensalista)
              .expect(200)
              .end(function (mensalistaDeleteErr, mensalistaDeleteRes) {
                // Handle mensalista error error
                if (mensalistaDeleteErr) {
                  return done(mensalistaDeleteErr);
                }

                // Set assertions
                (mensalistaDeleteRes.body._id).should.equal(mensalistaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mensalista if not signed in', function (done) {
    // Set Mensalista user
    mensalista.user = user;

    // Create new Mensalista model instance
    var mensalistaObj = new Mensalista(mensalista);

    // Save the Mensalista
    mensalistaObj.save(function () {
      // Try deleting Mensalista
      request(app).delete('/api/mensalista/' + mensalistaObj._id)
        .expect(403)
        .end(function (mensalistaDeleteErr, mensalistaDeleteRes) {
          // Set message assertion
          (mensalistaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mensalista error error
          done(mensalistaDeleteErr);
        });

    });
  });

  it('should be able to get a single Mensalista that has an orphaned user reference', function (done) {
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

          // Save a new Mensalista
          agent.post('/api/mensalista')
            .send(mensalista)
            .expect(200)
            .end(function (mensalistaSaveErr, mensalistaSaveRes) {
              // Handle Mensalista save error
              if (mensalistaSaveErr) {
                return done(mensalistaSaveErr);
              }

              // Set assertions on new Mensalista
              (mensalistaSaveRes.body.name).should.equal(mensalista.name);
              should.exist(mensalistaSaveRes.body.user);
              should.equal(mensalistaSaveRes.body.user._id, orphanId);

              // force the Mensalista to have an orphaned user reference
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

                    // Get the Mensalista
                    agent.get('/api/mensalista/' + mensalistaSaveRes.body._id)
                      .expect(200)
                      .end(function (mensalistaInfoErr, mensalistaInfoRes) {
                        // Handle Mensalista error
                        if (mensalistaInfoErr) {
                          return done(mensalistaInfoErr);
                        }

                        // Set assertions
                        (mensalistaInfoRes.body._id).should.equal(mensalistaSaveRes.body._id);
                        (mensalistaInfoRes.body.name).should.equal(mensalista.name);
                        should.equal(mensalistaInfoRes.body.user, undefined);

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
      Mensalista.remove().exec(done);
    });
  });
});
