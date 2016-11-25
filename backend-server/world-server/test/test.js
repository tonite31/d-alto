var assert = require('assert');
var io = require('socket.io-client');
var config = require('../../../config');

describe('Battle test', function()
{
	var conn = null;
	
	before(function(done)
	{
		conn = io('http://localhost:' + config.server['world-server'].port);
		if(conn != null)
		{
			conn.on('CONNECTION', function(code)
			{
				done();
			});
		}
		else
		{
			done();
		}
	});
	
	after(function()
	{
		if(conn)
		{
			conn.disconnect();
		}
	});
	
	it('test', function(done)
	{
		
		
		done();
	});
});