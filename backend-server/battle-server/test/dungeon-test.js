var assert = require('assert');
var httpMocks = require('node-mocks-http');

//var characterModule = require('../modules/dun\eonModule');
var dungeonModule = require('../modules/dungeonModule');

describe('Dungeon test', function()
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
			mongoose.connection.collections.dungeons.drop(function(err)
			{
				done();
			});
		});
	});
	
	afterEach(function()
	{
		conn.disconnect();
	});
	
	it('createDungeonMeta', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.number = 1;
		req.body.name = 'test dungeon';
		dungeonModule.createDungeonMeta(req, res, null, function()
		{
			var data = res._getData();
			
			assert.equal(res.statusCode, 201);
			
			done();
		});
	});
	
	it('getDungeon', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.number = 1;
		req.body.name = 'test dungeon';
		dungeonModule.createDungeonMeta(req, res, null, function()
		{
			var data = res._getData();
			
			assert.equal(res.statusCode, 201);
			
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.params.number = 1;
			
			dungeonModule.getDungeon(req, res, null, function()
			{
				var data = res._getData();
				
				assert.equal(res.statusCode, 200);
				assert.equal(data.number, req.params.number);
				
				done();
			});
		});
	});
	
	it('getDungeon', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.number = 1;
		req.body.name = 'test dungeon';
		dungeonModule.createDungeonMeta(req, res, null, function()
		{
			var data = res._getData();
			
			assert.equal(res.statusCode, 201);
			
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.params.number = 1;
			req.body.name = 'test1';
			dungeonModule.updateDungeon(req, res, null, function()
			{
				var data = res._getData();
				
				assert.equal(res.statusCode, 200);
				assert.equal(data.name, req.body.name);
				
				done();
			});
		});
	});
	
	it('deleteDungeon', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.number = 1;
		req.body.name = 'test dungeon';
		dungeonModule.createDungeonMeta(req, res, null, function()
		{
			var data = res._getData();
			
			assert.equal(res.statusCode, 201);
			
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.params.number = 1;
			dungeonModule.deleteDungeon(req, res, null, function()
			{
				var data = res._getData();
				
				assert.equal(res.statusCode, 200);
				
				done();
			});
		});
	});
	
	it('get map data', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.params.dungeonId = 'test';
		dungeonModule.getMapData(req, res, null, function()
		{
			var data = res._getData();
			
			assert.equal(res.statusCode, 200);
			assert(data instanceof Array);
			done();
		});
	});
});