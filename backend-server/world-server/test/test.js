var assert = require('assert');
var io = require('socket.io-client');
var config = require('../../../config');

var random = require("random-js")();

//월드를 구성하는 일반적인 역할을 맡는다.
var world = require('../modules/world');

describe('Scenario test', function()
{
	it('test', function()
	{
		world.createMaps(function()
		{
			
		});
	});
});