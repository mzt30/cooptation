var express = require('express');




/*var app = express();
app.use(express.static(__dirname));
// respond with "hello world" when a GET request is made to the homepage
app.get('/loterie', function(req, res) {
	res.redirect('/index.html');
});*/


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

var listeCoopte = [];
listeCoopte.unshift({"civilite":"M.", "nom":"toto", "prenom":"toto", "jeton":1});
listeCoopte.unshift({"civilite":"M.", "nom":"toto2", "prenom":"toto2", "jeton":1});


//lors de la connexion d'une nouvelle page
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('getListUser', function(){
    io.emit('setListUser', listeCoopte);
  });
  
  //sur l'appelle de l'ajout d'un user
  socket.on('addUser', function(user){
	  listeCoopte.unshift(user);
	  io.emit('setListUser', listeCoopte);
  });
  
  //ssur l'appelle d'une delete de user
  socket.on('deleteUser', function(id){
	  listeCoopte.splice(id-1, 1);
	  io.emit('setListUser', listeCoopte);
  });
  
  //sur l'appelle d'un get de random user
  socket.on('getRandomUser', function(indexLot){
	  var user = null;
	  var index = 0;
	  for(var i = 0; i< listeCoopte.length; i++){
		  if(listeCoopte[i].jeton > 0){
			  listeCoopte[i].jeton = 0;
			  io.emit('setRandomUser', listeCoopte[i], indexLot);
			  io.emit('setListUser', listeCoopte);
			  break;
		  }
	  }
  });
});

http.listen(8333, function(){
  console.log('listening on *:8333');
});



var Web3 = require('web3');
var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8333"));
}





