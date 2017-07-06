var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port2 = 3001;

//var io = require('socket.io')(port);
var socket2 = require('socket.io')(port2);
var socket = require('socket.io')(port);

var shortId = require('shortid');
const MongoClient = require('mongodb').MongoClient;

var players = [];
var thisPlayerId;
var playerSpeed = 3;

var db;

console.log("Server started at port : " + port2);


var room = shortId.generate();


socket.on('connection', function (socket) {
console.log("client Unity connected ");


socket.on('registerChat', function(data){
socket.join(data.rev.id+data.me.id);
console.log("client Unity Joint room ", data.rev.id+data.me.id);

    });


socket.on('login', function(data){
console.log(data.id);
MongoClient.connect('mongodb://pokemap:fucksatan001@ds032887.mlab.com:32887/pokemap', function(err, db) {
  if (err) throw err;
  var idd = data.id;
   var myobj = { id: data.id, username: data.name , email: data.email };
         db.collection("user").findOne({id:idd}).then(function(doc) {
                     if(!doc){
                              db.collection("user").insertOne(myobj, function(err, res) {
                                   if (err) throw err;
                                       console.log("1 record inserted");
                               });
                    }
            console.log(doc);//else case
            socket.emit('success',doc);
            console.log(doc);
        });
            
                    
   
  });

       
        //socket.broadcast.emit('send',data);
    });

 

socket.on('send', function(data){
    
    
        //data.id = thisPlayerId;
        //console.log(data.rec);
       // console.log('the player ' + data.id + 'Has Send this msg : ' + JSON.stringify(data.msg) + " To This Player : " + data.rec + "with id = : "+players[data.rec].sockid);
        //data.msg = data.msg;
        //data.id = data.id;
        //data.rec = data.rec;
        //socket.to(players[data.rec].sockid).emit('send', data);
socket.broadcast.to('a').emit('send',data);
console.log("broadcast ", room);

MongoClient.connect('mongodb://pokemap:fucksatan001@ds032887.mlab.com:32887/pokemap', function(err, db) {
  if (err) throw err;
   var myobj = { name: data.id, address: data.msg };
         db.collection("chat").insertOne(myobj, function(err, res) {
             if (err) throw err;
                console.log("1 record inserted");
   
  });
       
        //socket.broadcast.emit('send',data);
    });


});

socket.on('disconnect', function () {
        console.log('client disconected');
        delete players[thisPlayerId];
        socket.emit('disconnected', {id:thisPlayerId});
    });

});


socket2.on('connect', function (socket2) {
    
console.log("server started on port " + port2 +" And recived a Connection");
socket2.on("userS",function(data){
        // We got a message... I dunno what we should do with this...
        thisPlayerId=data.arrayToSendToBrowser.id
        
        players[thisPlayerId] = data.arrayToSendToBrowser;
        console.log(players[thisPlayerId].sockid);
        
    });




socket2.on('disconnect', function () {
        console.log('client disconected');
        delete players[thisPlayerId];
        socket2.emit('disconnected', {id:thisPlayerId});
    });

});



