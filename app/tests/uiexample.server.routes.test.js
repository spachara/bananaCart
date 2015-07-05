'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Uiexample = mongoose.model('Uiexample'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, uiexample;

/**
 * Uiexample routes tests
 */
describe('Uiexample CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
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

		// Save a user to the test db and create new Uiexample
		user.save(function() {
			uiexample = {
				name: 'Uiexample Name'
			};

			done();
		});
	});

	it('should be able to save Uiexample instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Uiexample
				agent.post('/uiexamples')
					.send(uiexample)
					.expect(200)
					.end(function(uiexampleSaveErr, uiexampleSaveRes) {
						// Handle Uiexample save error
						if (uiexampleSaveErr) done(uiexampleSaveErr);

						// Get a list of Uiexamples
						agent.get('/uiexamples')
							.end(function(uiexamplesGetErr, uiexamplesGetRes) {
								// Handle Uiexample save error
								if (uiexamplesGetErr) done(uiexamplesGetErr);

								// Get Uiexamples list
								var uiexamples = uiexamplesGetRes.body;

								// Set assertions
								(uiexamples[0].user._id).should.equal(userId);
								(uiexamples[0].name).should.match('Uiexample Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Uiexample instance if not logged in', function(done) {
		agent.post('/uiexamples')
			.send(uiexample)
			.expect(401)
			.end(function(uiexampleSaveErr, uiexampleSaveRes) {
				// Call the assertion callback
				done(uiexampleSaveErr);
			});
	});

	it('should not be able to save Uiexample instance if no name is provided', function(done) {
		// Invalidate name field
		uiexample.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Uiexample
				agent.post('/uiexamples')
					.send(uiexample)
					.expect(400)
					.end(function(uiexampleSaveErr, uiexampleSaveRes) {
						// Set message assertion
						(uiexampleSaveRes.body.message).should.match('Please fill Uiexample name');
						
						// Handle Uiexample save error
						done(uiexampleSaveErr);
					});
			});
	});

	it('should be able to update Uiexample instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Uiexample
				agent.post('/uiexamples')
					.send(uiexample)
					.expect(200)
					.end(function(uiexampleSaveErr, uiexampleSaveRes) {
						// Handle Uiexample save error
						if (uiexampleSaveErr) done(uiexampleSaveErr);

						// Update Uiexample name
						uiexample.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Uiexample
						agent.put('/uiexamples/' + uiexampleSaveRes.body._id)
							.send(uiexample)
							.expect(200)
							.end(function(uiexampleUpdateErr, uiexampleUpdateRes) {
								// Handle Uiexample update error
								if (uiexampleUpdateErr) done(uiexampleUpdateErr);

								// Set assertions
								(uiexampleUpdateRes.body._id).should.equal(uiexampleSaveRes.body._id);
								(uiexampleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Uiexamples if not signed in', function(done) {
		// Create new Uiexample model instance
		var uiexampleObj = new Uiexample(uiexample);

		// Save the Uiexample
		uiexampleObj.save(function() {
			// Request Uiexamples
			request(app).get('/uiexamples')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Uiexample if not signed in', function(done) {
		// Create new Uiexample model instance
		var uiexampleObj = new Uiexample(uiexample);

		// Save the Uiexample
		uiexampleObj.save(function() {
			request(app).get('/uiexamples/' + uiexampleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', uiexample.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Uiexample instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Uiexample
				agent.post('/uiexamples')
					.send(uiexample)
					.expect(200)
					.end(function(uiexampleSaveErr, uiexampleSaveRes) {
						// Handle Uiexample save error
						if (uiexampleSaveErr) done(uiexampleSaveErr);

						// Delete existing Uiexample
						agent.delete('/uiexamples/' + uiexampleSaveRes.body._id)
							.send(uiexample)
							.expect(200)
							.end(function(uiexampleDeleteErr, uiexampleDeleteRes) {
								// Handle Uiexample error error
								if (uiexampleDeleteErr) done(uiexampleDeleteErr);

								// Set assertions
								(uiexampleDeleteRes.body._id).should.equal(uiexampleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Uiexample instance if not signed in', function(done) {
		// Set Uiexample user 
		uiexample.user = user;

		// Create new Uiexample model instance
		var uiexampleObj = new Uiexample(uiexample);

		// Save the Uiexample
		uiexampleObj.save(function() {
			// Try deleting Uiexample
			request(app).delete('/uiexamples/' + uiexampleObj._id)
			.expect(401)
			.end(function(uiexampleDeleteErr, uiexampleDeleteRes) {
				// Set message assertion
				(uiexampleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Uiexample error error
				done(uiexampleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Uiexample.remove().exec();
		done();
	});
});