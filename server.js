var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var path = __dirname+"/client/"
 
fs.readdir(path, function(err, items) {
    console.log(items);
 
    for (var i=0; i<items.length; i++) {
        console.log(items[i]+":"+__dirname+"/client/"+items[i]);
    }
});

app.get('/images/:name', function(req , res){ 
  console.log(req.params[0]);
  res.sendFile(__dirname + '/client/images/'+req.params.name+'.png');
});

app.get('/scripts/:name', function(req , res){ 
  console.log(req.params.name);
  res.sendFile(__dirname + '/client/scripts/'+req.params.name+'.js');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/html/game.html');
});

/*
app.get('/client/game.js', function(req, res){
  res.sendFile(__dirname + '/client/game.js');
});

app.get('/client/test.png', function(req, res){
  res.sendFile(__dirname + '/client/test.png');
});
*/

var users = [];

io.on('connection', function(socket){
  console.log('a user connected');

  var user = {
   username: "notset",
   connection: socket
};
  users.push(user);
  console.log(users.length);

socket.on('disconnect', function(){
    console.log('user disconnected');
  });
    
socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg)
    {
    	io.emit('obj', {x:2, y:3, width:23, username: "asd"});
        console.log('message: ' + msg);
    });
    
    socket.on('login',function(msg)
    {
        console.log(msg);
    });
    
    socket.on('move',function(msg)
    {
    io.emit('move', msg);
    });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});