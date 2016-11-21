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






//----------------------------------------------------------------

var battleList = {};

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

app.post('/create-battle', function(req, res, next)
{
	var characterName = req.body.characterName;
	var userList = req.body.userList;
	
	if(battleList[characterName])
	{
		res.status(500).end('Duplicated');
	}
	else
	{
		battleList[characterName] = {key : new Date().getTime(), userList : userList};
		res.status(200).end(battleList[characterName]);
	}
});

app.post('/join-battle', function(req, res, next)
{
	var masterName = req.body.masterName;
	var characterName = req.body.characterName;
	var key = req.body.key;
	
	if(!battleList[masterName] || battleList[masterName].key != key)
	{
		res.status(404).end('Not found');
	}
	else
	{
		var check = false;
		var userList = battleList[masterName].userList;
		for(var i=0; i<userList.length; i++)
		{
			if(userList[i] == characterName)
			{
				check = true;
				break;
			}
		}
		
		if(!check)
		{
			res.status(404).end('Not found');
		}
		else
		{
			battleList[masterName].joinedList.push(characterName);
		}
	}
});