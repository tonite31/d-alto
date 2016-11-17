var assert = require('assert');

var users = require('../routes/users');

var config = require('../../../config')
var redis = require('redis');
var client = redis.createClient(config.redis.port, config.redis.host);

describe('Example', function()
{
	it('login test', function(done)
	{
		var httpMocks = require('node-mocks-http');
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		
		req.body = {
			username : 'test'
		};
		
		var client = require("redis").createClient(config.redis);
		client.on('connect', function()
		{
			req.redis = client;
			
			users.login(req, res, null, function()
			{
				assert.equal(200, res.statusCode);
				assert.equal('OK', res._getData());
				
				done();
			});
		});
	});
});