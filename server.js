var port = process.env.PORT || 5057;
var IPADDRESS = process.env.IP || '127.0.0.1';
var port2 = 3001;

var socket2 = require('socket.io')(port2);
var socket = require('socket.io')(port);

var shortId = require('shortid');
const MongoClient = require('mongodb').MongoClient;

var players = [];
var thisPlayerId;
var playerSpeed = 3;

var db;
var roomId;
var room = shortId.generate();



console.log("Server started at port : " + port);




socket.on('connection', function (socket) 
{
    console.log("client Unity connected ");


    socket.on('registerChat', function(data)
    {
        roomId =  data.rev.id+data.me.id
            socket.join(roomId);
                console.log("client Unity Joint room ", data.rev.id+data.me.id);
                    socket.broadcast.to(roomId).emit('successReg',roomId);
    });


    socket.on('login', function(data)
    {
        console.log(data.id);
            MongoClient.connect('mongodb://pokemap:fucksatan001@ds032887.mlab.com:32887/pokemap', function(err, db) 
            {
                if (err) throw err;
                    var idd = data.id;

                var myobj = { id: data.id, username: data.name , email: data.email };
                    db.collection("user").findOne({id:idd}).then(function(doc) 
                    {
                        if(!doc)
                        {
                                db.collection("user").insertOne(myobj, function(err, res) 
                                {
                                        if (err) throw err;
                                        console.log("1 record inserted");
                                });  
                        }
            
                        socket.emit('success',doc);
                        console.log(doc);
                    });
            
                    
   
             });

       
        //socket.broadcast.emit('send',data);
    });

 

    socket.on('send', function(data)
    {
        socket.broadcast.to(roomId).emit('send',data);
            console.log("broadcast ", roomId);

                MongoClient.connect('mongodb://pokemap:fucksatan001@ds032887.mlab.com:32887/pokemap', function(err, db) 
                {
                    if (err) throw err;
                        var myobj = { idSend: data.id, msg: data.msg ,idRes : data.res , idroom:data.room};
                            db.collection("chat").insertOne(myobj, function(err, res) 
                            {
                                if (err) throw err;
                                console.log("1 record inserted");
   
                            });
       
                    //socket.broadcast.emit('send',data);
                });


    });

    
    socket.on('disconnect', function () 
    {
            console.log('client disconected');
                delete players[thisPlayerId];
                    socket.emit('disconnected', {id:thisPlayerId});
    });

});


socket2.on('connect', function (socket2) 
{
    
        console.log("server started on port " + port2 +" And recived a Connection");
    
    socket2.on("userS",function(data)
    {
        thisPlayerId=data.arrayToSendToBrowser.id
        
            players[thisPlayerId] = data.arrayToSendToBrowser;
                console.log(players[thisPlayerId].sockid);
        
    });




    socket2.on('disconnect', function () 
    {
        console.log('client disconected');
            delete players[thisPlayerId];
                socket2.emit('disconnected', {id:thisPlayerId});
    });

});



