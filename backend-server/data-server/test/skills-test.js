var assert = require('assert');
var skills = require('../routes/skills');
var config = require('../../../config')

describe('Skills test', function()
{
	it('Create skill', function()
	{
		var httpMocks = require('node-mocks-http');
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		
		req.body.name = "테스트 캐릭터";
		req.body.skills = [1, 2, 3, 4];

		//db에 넣는 작업
		skills.create(req, res, null, function()
		{
			//db에서 꺼내는 작업.
			assert.equal(res._getData().name, "테스트 캐릭터");
		});
	});
	
	it('get skills', function()
	{
		var httpMocks = require('node-mocks-http');
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		
		//db에 넣는 작업
		skills.create(req, res, null, function()
		{
			//db에서 꺼내는 작업.
			assert.equal(res._getData().name, "테스트 캐릭터");
		});
	});
});