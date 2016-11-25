var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var path = require('./libs/path');
path.add('views',__dirname + '/views');

var config = require('../../config');

var app = global._app = express();

var server = app.listen(config.server['world-server'].port, function()
{
	console.log('Listening on port %d', server.address().port);
});

var sessionMiddleware = null;

if(config.redis && config.redis.host && config.redis.port)
{
	var RedisStore = require('connect-redis')(session);
	var redis = require("redis");
	var client = require("redis").createClient(config.redis);
	
	client.on('connect', function()
	{
		console.log('connected to redis!!');
	});
	
	app.use(sessionMiddleware = session({
	    store: new RedisStore({client: client}),
	    secret: 'd-alto',
	    saveUninitialized: true,
	    resave: false
	}));
}
else
{
	app.use(sessionMiddleware = session({ secret: 'd-alto', resave: true, saveUninitialized: true}));
}

app.use('/views', express.static(path.get('views')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(require('./libs/renderer'));

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





//var row = 100;
//var col = 100;
//var map = [];
//for(var i=0; i<col; i++)
//{
//	map[i] = [];
//}
//
//var setCharacterPosition = function(character)
//{
//	for(var i=0; i<row; i++)
//	{
//		for(var j=0; j<col; j++)
//		{
//			if(!map[i][j])
//			{
//				map[i][j] = character;
//				character.position = {x : i, y : j};
//				return;
//			}
//		}
//	}
//};

var characters = {};

app.get('/', function(req, res, next)
{
	if(!req.session.character)
	{
		req.session.character = {id : new Date().getTime(), position : {x : 0, y : 0}, moveSpeed : 1};
		characters[req.session.character.id] = req.session.character;
	}
	
	res.render('index');
});




var io = require('socket.io')(server);
io.use(function(socket, next)
{
	sessionMiddleware(socket.request, socket.request.res, next);
});

io.on('connection', function(client)
{
	if(!client.request.session.character)
		return;
	
	var character = characters[client.request.session.character.id];
	
	client.emit('CONNECTED', characters);
	client.broadcast.emit('USER_CONNECTED', character);
	client.on('MOVE_CHARACTER', function(direction)
	{
		var originPosition = JSON.parse(JSON.stringify(character.position));
		if(direction == 'right')
			character.position.x += character.moveSpeed;
		else if(direction == 'left')
			character.position.x -= character.moveSpeed;
		else if(direction == 'down')
			character.position.y += character.moveSpeed;
		else if(direction == 'up')
			character.position.y -= character.moveSpeed;
		
//		character.position = originPosition;
//		io.emit('MOVE_CHARACTER', {id : character.id, position : character.position, direction : direction});
	});
	
	setInterval(function()
	{
		io.emit('MOVE_CHARACTER', characters);
	}, 1000 / 30); //30프레임
});