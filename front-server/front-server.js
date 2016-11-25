var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var path = require('./libs/path');
path.add('views',__dirname + '/views');

var config = require('../config');

var app = global._app = express();

var server = app.listen(config.server['front-server'].port, function()
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

app.use(function(req, res, next)
{
	if(!req.session)
		req.session = {};
	
	next();
});

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

var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function()
{
	console.log("Connected to mongod server");
});

mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/front-server');

require('./routers/indexRouter')(app);
require('./routers/userRouter')(app);
require('./routers/characterRouter')(app);


//var index = require('./routes/index');
//
//var battleSession = {};
//
//app.get('/', function(req, res, next)
//{
//	res.render('index');
//});
//
//app.get('/battle/:roomId', function(req, res, next)
//{
//	index.checkUserInTheRoom(req, function(statusCode, result)
//	{
//		if(statusCode == 200 && result == 'true')
//		{
//			//startBattle
//			index.getControlId(req, function(statusCode, controlId)
//			{
//				if(statusCode == 200)
//				{
//					var socket = require('socket.io-client')('http://localhost:' + config.server['battle-server'].port);
//					socket.on('connect', function()
//					{
//						battleSession[controlId] = socket;
//						req.session.battle = {roomId : "room", controlId : controlId};
//						res.render('battle');
//					});
//					
//					socket.on('disconnect', function()
//					{
//						req.session.battle = null;
//						res.status(401).end();
//					});
//				}
//				else
//				{
//					res.status(500).end(result);
//				}
//			});
//		}
//		else
//		{
//			res.status(401).end('not authorized');
//		}
//	});
//});
//
//app.get('/api/getRandomCharacter', index.getRandomCharacter);
//app.post('/api/joinBattleRoom', index.joinBattleRoom);
//
//
////--------------------------------------------------------
//
//
var battleModule = require('./modules/battleModule');
var io = require('socket.io')(server);
io.use(function(socket, next)
{
	sessionMiddleware(socket.request, socket.request.res, next);
});

io.on('connection', function(client)
{
	if(req.session.socketTimeout)
	{
		clearTimeout(req.session.socketTimeout);
		req.session.socketTimeout = null;
	}
	
	var conn = battleModule.connections[client.request.session.userCharacterId];
	var character = req.session.character[client.request.session.userCharacterId];
	if(conn)
	{
		var dungeonId = character.dungeonId;
		var controlId = character.controlId;
		
		client.on('MOVE_CHARACTER', function(data)
		{
			conn.moveCharacter(dungeonId, controlId, data);
//			battleClient.emit('MOVE_CHARACTER', {roomId : battleData.roomId, controlId : battleData.controlId, direction : data});
		});
	}
	
	client.on('disconnect', function()
	{
		req.session.socketTimeout = setTimeout(function()
		{
			conn.disconnect();
		}, 5000);
	});
});