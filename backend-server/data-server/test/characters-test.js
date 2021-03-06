var assert = require('assert');
var httpMocks = require('node-mocks-http');

var characterModule = require('../modules/characterModule');
var characterSchema = require('../schema/characterSchema');

var config = require('../../../config');

describe('Character test', function()
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
			mongoose.connection.collections.characters.drop(function(err)
			{
				done();
			});
		});
	});
	
	afterEach(function()
	{
		conn.disconnect();
	});
	
	it('getCharacters', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		characterModule.getCharactersByUsername(req, res, null, function()
		{
			var data = res._getData();
			assert(data instanceof Array);
			done();
		});
	});
	
	it('getRandomCharacterStat', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		characterModule.getRandomCharacterStat(req, res, null, function()
		{
			var data = res._getData();
			assert(typeof data.hp == 'number');
			assert(typeof data.mp == 'number');
			done();
		});
	});
	
	it('createCharacter', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.username = 'tester';
		req.body.characterName = 'test_character';
		req.body.hp = 10;
		req.body.mp = 10;
		
		characterModule.createCharacter(req, res, null, function()
		{
			var data = res._getData();
			assert(typeof data.hp == 'number');
			assert(typeof data.mp == 'number');
			done();
		});
	});
	
	it('deleteCharacter', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.username = 'tester';
		req.body.characterName = 'test_character';
		req.body.hp = 10;
		req.body.mp = 10;
		
		characterModule.createCharacter(req, res, null, function()
		{
			var data = res._getData();
			assert(typeof data.hp == 'number');
			assert(typeof data.mp == 'number');
			
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.body._id = data._id;
			
			characterModule.deleteCharacter(req, res, null, function()
			{
				var data = res._getData();
				assert(res.statusCode, 200);
				done();
			});
		});
	});
	
	it('getCharacter', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.body.username = 'tester';
		req.body.characterName = 'test_character';
		req.body.hp = 10;
		req.body.mp = 10;
		
		characterModule.createCharacter(req, res, null, function()
		{
			var data = res._getData();
			assert(typeof data.hp == 'number');
			assert(typeof data.mp == 'number');
			
			req = httpMocks.createRequest();
			res = httpMocks.createResponse();
			
			req.session = {username : 'tester'};
			req.params._id = data._id;
			
			characterModule.getCharacter(req, res, null, function()
			{
				req = httpMocks.createRequest();
				res = httpMocks.createResponse();
				
				req.params._id = data._id;
				
				characterModule.deleteCharacter(req, res, null, function()
				{
					var data = res._getData();
					assert(res.statusCode, 200);
					done();
				});
			});
		});
	});
});

//describe('Character test', function()
//{
//	var conn = null;
//	before(function(done)
//	{
//		var mongoose = require('mongoose');
//		var db = mongoose.connection;
//		db.on('error', console.error);
//		
//		mongoose.Promise = require('bluebird');
//		 
//		conn = mongoose.connect('mongodb://localhost:27018/test', function()
//		{
//			mongoose.connection.collections.characters.drop(function(err)
//			{
//				done();
//			});
//		});
//	});
//	
//	after(function()
//	{
//		conn.disconnect();
//	});
//	
//	describe('Test group for character creation', function()
//	{
//		var characterId = null;
//		before(function(done)
//		{
//			req = httpMocks.createRequest();
//			res = httpMocks.createResponse();
//			
//			req.body.userId = 'testUser';
//			req.body.name = 'Tester';
//			
//			characters.create(req, res, null, function()
//			{
//				characterId = res._getData()._id;
//				done();
//			});
//		});
//		
//		it('Get characters of user', function(done)
//		{
//			req = httpMocks.createRequest();
//			res = httpMocks.createResponse();
//			
//			req.body.userId = 'testUser';
//				
//			characters.getCharacters(req, res, null, function()
//			{
//				assert(res._getData() instanceof Array);
//				assert(res._getData()[0].name == 'Tester');
//				done();
//			});
//		});
//		
//		it('Bind skills to character', function(done)
//		{
//			req = httpMocks.createRequest();
//			res = httpMocks.createResponse();
//
//			req.body._id = characterId;
//			req.body.skills = [1, 2, 3, 4];
//			characters.bindSkills(req, res, null, function()
//			{
//				characterSchema.findOne({_id : characterId}).exec(function(err, data)
//				{
//					var skills = data.skills;
//					assert(skills instanceof Array);
//					assert.equal(skills[0], 1);
//					assert.equal(skills[1], 2);
//					assert.equal(skills[2], 3);
//					assert.equal(skills[3], 4);
//					done();
//				});
//			});
//		});
//	});
//	
//	describe('Test group for need not character creation', function()
//	{
//		it('Create Character', function(done)
//		{
//			req = httpMocks.createRequest();
//			res = httpMocks.createResponse();
//
//			req.body.userId = 'testUser';
//			req.body.name = 'tester';
//
//			characters.create(req, res, null, function()
//			{
//				characterSchema.findOne({userId : req.body.userId, name : req.body.name}).exec(function(err, data)
//				{
//					if(err)
//					{
//						console.error(err);
//					}
//					else
//					{
//						assert.equal(data.userId, req.body.userId);
//						assert.equal(data.name, req.body.name);
//						done();
//					}
//				});
//			});
//		});
//	});
//});