var assert = require('assert');
var httpMocks = require('node-mocks-http');

var characterModule = require('../modules/characterModule');

var config = require('../../config');

describe('Characters test', function()
{
	it('get my characters', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.session = {username : 'tester'};
		
		characterModule.getMyCharacters(req, res, null, function()
		{
			var data = res._getData();
			data = JSON.parse(data);
			assert.equal(res.statusCode, 200);
			assert(data instanceof Array);
			done();
		});
	});
	
	it('get random character stat', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.session = {username : 'tester'};
		
		characterModule.getRandomCharacterStat(req, res, null, function()
		{
			var data = res._getData();
			data = JSON.parse(data);
			assert.equal(res.statusCode, 200);
			assert(typeof data.hp == 'number');
			assert(typeof data.mp == 'number');
			done();
		});
	});
	
	it('create character', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.session = {};
		req.session.username = 'tester';
		req.body.characterName = 'test_character';
		
		characterModule.getRandomCharacterStat(req, res, null, function()
		{
			var data = res._getData();
			data = JSON.parse(data);
			assert.equal(res.statusCode, 200);
			assert(typeof data.hp == 'number');
			assert(typeof data.mp == 'number');
			
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.session = {};
			req.session.lastRandomCharacterData = data;
			req.session.username = 'tester';
			
			req.body.username = 'tester';
			req.body.characterName = 'test_character';
			
			characterModule.createCharacter(req, res, null, function()
			{
				var data = res._getData();
				data = JSON.parse(data);
				assert.equal(res.statusCode, 201);
				assert(data._id);
				done();
			});
		});
	});
	
	it('get character', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.session = {};
		req.session.username = 'tester';
		req.body.characterName = 'test_character';
		
		characterModule.getRandomCharacterStat(req, res, null, function()
		{
			var data = res._getData();
			data = JSON.parse(data);
			assert.equal(res.statusCode, 200);
			assert(typeof data.hp == 'number');
			assert(typeof data.mp == 'number');
			
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.session = {};
			req.session.lastRandomCharacterData = data;
			req.session.username = 'tester';
			
			req.body.username = 'tester';
			req.body.characterName = 'test_character';
			
			characterModule.createCharacter(req, res, null, function(data)
			{
				var data = res._getData();
				data = JSON.parse(data);
				assert.equal(res.statusCode, 201);
				assert(data._id);
				
				characterModule.getCharacter('tester', data._id, function(code, data)
				{
					assert.equal(code, 200);
					assert(data);
					
					req = httpMocks.createRequest();
					res = httpMocks.createResponse();
					
					req.session = {username : 'tester'};
					req.body.characterId = data._id;
					
					characterModule.deleteCharacter(req, res, null, function(data)
					{
						done();
					});
				});
			});
		});
	});
});