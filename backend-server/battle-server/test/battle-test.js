var assert = require('assert');
var httpMocks = require('node-mocks-http');

var dungeonModule = require('../modules/dungeonModule');

var config = require('../../../config');

describe('Battle test', function()
{
	it('createDungeon for error', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		dungeonModule.createDungeonInstance(req, res, null, function()
		{
			var data = res._getData();
			assert.equal(res.statusCode, 500);
			assert.equal(data, 'map_number_not_found');
			
			done();
		});
	});
	
	it('createDungeon', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.mapNumber = 1;
		
		dungeonModule.createDungeonInstance(req, res, null, function()
		{
			var data = res._getData();
			assert.equal(res.statusCode, 201);
			assert(data);
			
			done();
		});
	});
});