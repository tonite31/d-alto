//var assert = require('assert');
//var httpMocks = require('node-mocks-http');
//
//var skills = require('../routes/skills');
//
//var config = require('../../../config');

//describe('Skills test', function()
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
//			mongoose.connection.collections.skills.drop(function(err)
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
//	it('Create skill', function()
//	{
//		req = httpMocks.createRequest();
//		res = httpMocks.createResponse();
//		
//		req.body.number = 0;
//		req.body.name = '테스트 스킬';
//		
//		skills.create(req, res, null, function(data)
//		{
//			assert.equal(res.statusCode, 200);
//			assert.equal(res._getData().number, 0);
//			assert.equal(res._getData().name, '테스트 스킬');
//		});
//	});
//	
//	it('get skills', function()
//	{
//		req = httpMocks.createRequest();
//		res = httpMocks.createResponse();
//		
//		skills.getSkills(req, res, null, function(data)
//		{
//			assert.equal(res.statusCode, 200);
//			assert(res._getData() instanceof Array);
//		});
//	});
//});