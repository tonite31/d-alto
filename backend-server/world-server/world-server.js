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



var world = require('./modules/world');
var object = require('./modules/object');

var characters = {};

app.get('/', function(req, res, next)
{
	if(!req.session.characterId)
	{
		//현재 접속한 사용자의 캐릭터 생성 후 저장.
		req.session.characterId = world.createCharacter().id;
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
	//캐릭터가 생성되어 있어야만 동작.
	if(!client.request.session.characterId)
		return;
	
	var character = world.getCharacter(client.request.session.characterId);
	
	//접속한 사람은 맵을 한 번 그려야 하므로.
	client.emit('CONNECTED', {map : world.getMap(), character : character});
	
	//나머지 유저들은 접속한 유저의 정보를 받아야 하므로.
	client.broadcast.emit('USER_CONNECTED', character);
	
	//캐릭터의 움직임.
	client.on('MOVE_CHARACTER', function(direction)
	{
		var tempObject = object.move(character, direction);
		
		if(world.checkObjectMovable(world.getMap(), tempObject))
		{
			character.property.prevPosition = character.property.position;
			character.property.position = tempObject.property.position;
			
			delete tempObject;
			//이건 일단 보류 스크롤을 위한 emit이다.
//			client.emit('MOVE_CHARACTER', {character : character, direction : direction});
		}
		
		
//		var tc = JSON.parse(JSON.stringify(character));
//		
//		if(direction == 'right')
//			tc.position.x += character.moveSpeed;
//		else if(direction == 'left')
//			tc.position.x -= character.moveSpeed;
//		else if(direction == 'down')
//			tc.position.y += character.moveSpeed;
//		else if(direction == 'up')
//			tc.position.y -= character.moveSpeed;
//		
//		if(world.checkObjectMovableInMap(world.getMap(), tc))
//		{
//			//다른 놈들의 움직임은 스크롤링이 필요 없으므로 프레임처리하고 나만 스크롤링을 위해서 항상 처리하는걸로.
//			character.prevPosition = character.position;
//			character.position = tc.position;
//			
//			client.emit('MOVE_CHARACTER', {character : character, direction : direction});
//		}
	});
	
	setInterval(function()
	{
		//매번 다시 그려야 하는것은 일단은 움직이는 오브젝트들이다.
		io.emit('UPDATE_MAP', world.getMap());
	}, 1000 / 30); //30프레임
});