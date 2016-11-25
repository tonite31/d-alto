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





app.get('/', function(req, res, next)
{
	res.render('index');
});



var row = 100;
var col = 100;
var map = [];
for(var i=0; i<col; i++)
{
	map[i] = [];
}

var setCharacterPosition = function(character)
{
	for(var i=0; i<row; i++)
	{
		for(var j=0; j<col; j++)
		{
			if(!map[i][j])
			{
				map[i][j] = character;
				character.position = {x : i, y : j};
				return;
			}
		}
	}
};

var io = require('socket.io')(server);
io.on('connection', function(client)
{
	console.log("connection");
	
	var character = {id : new Date().getTime(), moveSpeed : 1};
	setCharacterPosition(character);
	
	client.emit('CONNECTION', {map : map, character : character});
	
	client.on('MOVE_CHARACTER', function(direction)
	{
		var originPosition = JSON.parse(JSON.stringify(character.position));
		if(direction == 'e')
			character.position.x += character.moveSpeed;
		else if(direction == 'w')
			character.position.x -= character.moveSpeed;
		else if(direction == 's')
			character.position.y += character.moveSpeed;
		else if(direction == 'n')
			character.position.y -= character.moveSpeed;
		
		if(character.position.y >= 0 && character.position.x >= 0 && character.position.y < row && character.position.x < col)
		{
			if(!map[character.position.x][character.position.y])
			{
				map[character.position.x][character.position.y] = character;
				map[originPosition.x][originPosition.y] = null;
				
				io.emit('MOVE_CHARACTER', {id : character.id, position : character.position});
				return;
			}
		}
		
		character.position = originPosition;
	});
});