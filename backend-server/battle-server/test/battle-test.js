var assert = require('assert');
var httpMocks = require('node-mocks-http');

var battle = require('../routes/battle');

var config = require('../../config');

describe('Battle test', function()
{
	it('joinBattleRoom', function(done)
	{
		var req = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		
		req.session = {};
		req.session.character = {hp : 100, mp : 100, name : 'tester'};
		
		battle.joinBattleRoom(req, res, null, function()
		{
			var data = res._getData();
			assert.equal(res.statusCode, 200);
			assert.equal(data.roomId, 1);
			done();
		});
	});
});