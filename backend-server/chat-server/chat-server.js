var config = require('../../config');

var http = require('http');
var io = require('socket.io');
var server = http.createServer(function(req, res) {});

server.listen(config.server['chat-server'].port, null);

var socket = io.listen(server);
socket.on('connection', function(client)
{
	var roomId = null;
    client.on('SEND_MSG', function(data)
    { 
    	socket.to(roomId).emit('RECEIVE_MSG', data);
    });
    
    client.on('joinRoom',function(data)
    {
        roomId = data;
        client.join(roomId);
    });
    
    client.on('leaveRoom',function()
    {
    	client.leave(roomId);
    });
    
    client.on('disconnect', function()
    {
    	client.leave(roomId);
    });
});