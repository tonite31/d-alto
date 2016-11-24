var assert = require('assert');
var httpMocks = require('node-mocks-http');

var userModule = require('../modules/userModule');

var config = require('../../config');

describe('Users test', function()
{
	var conn = null;
	beforeEach(function(done)
	{
		var mongoose = require('mongoose');
		var db = mongoose.connection;
		db.on('error', console.error);
		
		mongoose.Promise = require('bluebird');
		 
		conn = mongoose.connect('mongodb://localhost:27018/test', function()
		{
			mongoose.connection.collections.users.drop(function(err)
			{
				done();
			});
		});
	});
	
	afterEach(function()
	{
		conn.disconnect();
	});
	
	it('Create user', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.username = 'tester';
		req.body.password = '1234';
		
		userModule.createUser(req, res, null, function()
		{
			var data = res._getData();
			assert.equal(res.statusCode, 201);
			done();
		});
	});
	
	it('Login success', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.username = 'tester';
		req.body.password = '1234';
		
		userModule.createUser(req, res, null, function()
		{
			assert.equal(res.statusCode, 201);
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.session = {};
			req.body.username = 'tester';
			req.body.password = '1234';
			
			userModule.login(req, res, null, function()
			{
				var data = res._getData();
				assert.equal(res.statusCode, 200);
				assert.equal(data, 'login_success');
				done();
			});
		});
	});
	
	it('Login of not found', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.username = 'tester';
		req.body.password = '1234';
		
		userModule.login(req, res, null, function()
		{
			var data = res._getData();
			assert.equal(res.statusCode, 404);
			done();
		});
	});
	
	it('Login of disaccord', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.username = 'tester';
		req.body.password = '1234';
		
		userModule.createUser(req, res, null, function()
		{
			assert.equal(res.statusCode, 201);
			req.body.password = '';
			userModule.login(req, res, null, function()
			{
				var data = res._getData();
				assert.equal(res.statusCode, 200);
				assert.equal(data, 'password_disaccord');
				done();
			});
		});
	});
	
	it('use chearacter', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.session = {};
		req.session.username = 'tester';
		req.body.characterId = '1234';
		req.body.username = 'tester';
		req.body.password = '1234';
		
		userModule.createUser(req, res, null, function()
		{
			assert.equal(res.statusCode, 201);
			
			res = httpMocks.createResponse();
			userModule.login(req, res, null, function()
			{
				var data = res._getData();
				assert.equal(res.statusCode, 200);
				assert.equal(data, 'login_success');
				
				res = httpMocks.createResponse();
				userModule.checkLoginState(req, res, null, function()
				{
					var data = res._getData();
					assert.equal(res.statusCode, 200);
					assert.equal(data, 'true');
					
					done();
				});
			});
		});
	});
});