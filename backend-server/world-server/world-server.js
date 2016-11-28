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

var io = require('socket.io')(server);
io.use(function(socket, next)
{
	sessionMiddleware(socket.request, socket.request.res, next);
});

require('./modules/main')(app, io);