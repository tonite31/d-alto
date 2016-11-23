var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var io = require('socket.io');

var config = require('../../config');

var app = global._app = express();

var server = app.listen(config.server['battle-server'].port, function()
{
	console.log('Listening on port %d', server.address().port);
});

if(config.redis && config.redis.host && config.redis.port)
{
	var RedisStore = require('connect-redis')(session);
	var redis = require("redis");
	var client = require("redis").createClient(config.redis);
	
	client.on('connect', function()
	{
		console.log('connected to redis!!');
	});
	
	app.use(session({
	    store: new RedisStore({client: client}),
	    secret: 'd-alto',
	    saveUninitialized: true,
	    resave: false
	}));
}
else
{
	app.use(session({ secret: 'd-alto', resave: true, saveUninitialized: true}));
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(function(err, req, res, next)
{
	console.error('=================================================');
	console.error('time : ' + new Date().toString());
	console.error('name : Exception');
	console.error('-------------------------------------------------');
	console.error(err.stack);
	console.error('=================================================');

	res.statusCode = 500;
	res.send(err.stack);
});

process.on('uncaughtException', function (err)
{
	console.error('\n\n');
	console.error('=================================================');
	console.error('time : ' + new Date().toString());
	console.error('name : UncaughtException');
	console.error('-------------------------------------------------');
	console.error(err.stack);
	console.error('=================================================\n\n');
});



var battleRouter = require('./routes/battleRoute');
app.get('/clearBattleRoom', battleRouter.clearBattleRoom);
app.get('/checkUserInTheRoom', battleRouter.checkUserInTheRoom);
app.post('/joinBattleRoom', battleRouter.joinBattleRoom);
app.post('/getControlId', battleRouter.getControlId);
app.get('/getCharacterPosition', battleRouter.getCharacterPosition);


//----------------------------------------------------------------
var battle = require('./module/battle');

var socket = io.listen(server);
socket.on('connection', function(client)
{
	client.on('INIT_CHARACTER_POSITION', function(data)
	{
		var roomId = data.roomId;
		var controlId = data.controlId;
		var position = battle.setInitPositionOfCharacter(roomId, controlId);
		if(!position)
		{
			client.emit('INIT_CHARACTER_POSITION', null);
		}
		else
		{
			client.emit('INIT_CHARACTER_POSITION', position);
		}
	});
	
	client.on('MOVE_CHARACTER_POSITION', function(data)
	{
		var roomId = data.roomId;
		var controlId = data.controlId;
		var direction = data.direction;
		
		var result = battle.moveCharacter(roomId, controlId, direction);
		if(result == null)
		{
			client.emit('MOVE_CHARACTER_POSITION', null);
		}
		else if(result == false)
		{
			client.emit('MOVE_CHARACTER_POSITION', false);
		}
		else
		{
			socket.emit('MOVE_CHARACTER_POSITION', result);
		}
	});
});