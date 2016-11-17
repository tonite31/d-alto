var http = require('http');
var io = require('socket.io');
var server = http.createServer(function(req, res) {});

server.listen(9000, null);

var socket = io.listen(server);

var id = 0;

socket.on('connection', function(client)
{
	client.emit('CONNECTED', id++)
	console.log('contected : ', id);
	
	client.broadcast.emit('USER_CONNECTED', id);
	
    client.on('MOVE_CHARACTER', function(msg)
    { 
    	client.broadcast.emit('MOVE_CHARACTER', msg);
    });
    
    client.on('disconnect', function()
    {
    	
    });
});