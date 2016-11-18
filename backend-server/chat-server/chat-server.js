var config = require('../../config');

var http = require('http');
var io = require('socket.io');
var server = http.createServer(function(req, res) {});

server.listen(config.server['chat-server'].port, null);

var socket = io.listen(server);

socket.on('connection', function(client)
{
	client.on('USER_CONNECTED', function(name)
	{
	});
	
    client.on('MOVE_CHARACTER', function(msg)
    { 
    	client.broadcast.emit('MOVE_CHARACTER', msg);
    });
    
    client.on('disconnect', function()
    {
    	
    });
});