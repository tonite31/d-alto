var config = require('../../config');

var http = require('http');
var io = require('socket.io');
var server = http.createServer(function(req, res) {});

server.listen(config.server['chat-server'].port, null);

var socket = io.listen(server);
socket.on('connection', function(client)
{
    client.on('MESSAGE', function(data)
    { 
    	socket.to(data.roomId).emit('MESSAGE', data.message);
    });
    
    client.on('joinRoom',function(data)
    {
        client.join(data.roomId);
    });
});