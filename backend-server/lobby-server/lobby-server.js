var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var io = require('socket.io');

var config = require('../../config');

var app = global._app = express();

var server = app.listen(config.server['lobby-server'].port, function()
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






//----------------------------------------------------------------

var userList = {};

var socket = io.listen(server);
socket.on('connection', function(client)
{
	client.on('USER_CONNECTED', function(data)
	{
		if(userList[data.characterName] == data.key)
		{
			userList[data.characterName] = client;
			client.characterName = data.characterName;
		}
	});
	
	var roomId = null;
    client.on('SEND_MSG', function(data)
    { 
    	socket.to(roomId).emit('RECEIVE_MSG', data);
    });
    
    client.on('START_BATTLE', function()
    {
    	//create battle
    	//receive battle id
    	client.to(roomId).emit('START_BATTLE', {name : client.characterName});
    });
    
    client.on('joinRoom',function(data)
    {
        roomId = data;
        client.join(roomId);
    });
    
    client.on('leaveRoom',function()
    {
    	client.leave(roomId);
    	delete userList[client.characterName];
    	
    	var keys = [];
    	for(var key in userList)
    	{
    		keys.push(key);
    	}
    	
    	socket.to(roomId).emit('REFRESH_USER_LIST', keys);
    });
    
    client.on('disconnect', function()
    {
    	client.leave(roomId);
    	delete userList[client.characterName];
    	
    	var keys = [];
    	for(var key in userList)
    	{
    		keys.push(key);
    	}
    	
    	socket.to(roomId).emit('REFRESH_USER_LIST', keys);
    });
});

app.post('/user-connect', function(req, res, next)
{
	var user = req.body.username;
	var characterName = req.body.characterName;
	
	userList[characterName] = new Date().getTime();
	
	res.status(200).end(userList[characterName]);
});

app.get('/users', function(req, res, next)
{
	var keys = [];
	for(var key in userList)
	{
		keys.push(key);
	}
	
	res.status(200).send(keys);
});