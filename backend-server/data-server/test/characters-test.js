var assert = require('assert');
var characters = require('../routes/characters');
var config = require('../../../config')

describe('Character test', function()
{
	it('Create Character', function()
	{
		var httpMocks = require('node-mocks-http');
		req = httpMocks.createRequest();
		res = httpMocks.createResponse();
		
		req.body.name = "테스트 캐릭터";
		req.body.skills = [1, 2, 3, 4];

		//db에 넣는 작업
		characters.create(req, res, null, function()
		{
			//db에서 꺼내는 작업.
			assert.equal(res._getData().name, "테스트 캐릭터");
		});
	});
});