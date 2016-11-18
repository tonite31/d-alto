var assert = require('assert');
var users = require('../routes/users');
var config = require('../../../config')

describe('User-server Test', function()
{
	before(function(done)
	{
		var mongoose = require('mongoose');
		var db = mongoose.connection;
		db.on('error', console.error);
		db.once('open', function(){});
		
		mongoose.Promise = require('bluebird');
		 
		mongoose.connect('mongodb://localhost:27018/test', function()
		{
			mongoose.connection.collections.users.drop(function(err)
			{
				done();
			});
		});
	});
	
	it('Create user test', function(done)
	{
		var httpMocks = require('node-mocks-http');
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		
		req.body = {
			username : 'test',
			password : '1234'
		};
		
		users.create(req, res, null, function()
		{
			assert.equal(res.statusCode, 201);
			
			var UserSchema = require('../schema/user');
			UserSchema.findOne({username : req.body.username}).exec(function(err, data)
			{
				if(err)
				{
					console.error(err);
				}
				else
				{
					assert(data._id);
					assert.equal(data.username, req.body.username);
					assert.equal(data.password, req.body.password);
					done();
				}
			});
		});
	});
	
	it('Login test', function(done)
	{
		var httpMocks = require('node-mocks-http');
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		
		req.body = {
			username : 'test',
			password : '1234'
		};
			
		users.create(req, res, null, function()
		{
			assert.equal(res.statusCode, 201);
			
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.body = {
				username : 'test',
				password : '1234'
			};
			
			users.login(req, res, null, function()
			{
				assert.equal(200, res.statusCode);
				assert.equal(req.body.username, res._getData());
				done();
			});
		});
	});
});