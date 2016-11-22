var assert = require('assert');
var httpMocks = require('node-mocks-http');

var index = require('../routes/index');

var config = require('../../config');

describe('Character test', function()
{
	it('getRandomCharacter', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.session = {};
		
		index.getRandomCharacter(req, res, null, function()
		{
			var data = res._getData();
			assert.equal(typeof data, 'object');
			assert.equal(res.statusCode, 200);
			assert(data.hp);
			assert(data.mp);
			done();
		});
	});

	it('joinBattleRoom', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.session = {};
		req.session.character = {hp : 100, mp : 100};
		req.body.name = 'tester';
		
		index.clearBattleRoom(req, res, null, function()
		{
			index.joinBattleRoom(req, res, null, function()
			{
				var data = res._getData();
				assert.equal(res.statusCode, 200);
				assert.equal(data.roomId, "room");
				done();
			});
		});
	});
	
	it('isThisSessionInTheRoom', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		index.clearBattleRoom(req, res, null, function()
		{
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.session = {};
			req.session.character = {hp : 100, mp : 100};
			req.body.name = 'tester';
			
			index.joinBattleRoom(req, res, null, function()
			{
				req = httpMocks.createRequest();
				res = httpMocks.createResponse();
				
				req.session = {};
				req.session.character = {hp : 100, mp : 100, name : 'tester'};
				req.params.roomId = "room";
				
				index.checkUserInTheRoom(req, function(statusCode, result)
				{
					assert.equal(200, statusCode);
					assert.equal(result, "true");
					done();
				});
			});
		});
	});
	
	it('startBattle', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		index.clearBattleRoom(req, res, null, function()
		{
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.session = {};
			req.session.character = {hp : 100, mp : 100};
			req.body.name = 'tester';
			
			index.joinBattleRoom(req, res, null, function()
			{
				req = httpMocks.createRequest();
				res = httpMocks.createResponse();
				
				req.session = {};
				req.session.character = {hp : 100, mp : 100, name : 'tester'};
				req.params.roomId = "room";
				
				index.getControlId(req, function(statusCode, controlId)
				{
					assert.equal(200, statusCode);
					assert(controlId);
					done();
				});
			});
		});
	});
});