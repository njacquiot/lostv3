var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let routes = require('./routes')(app);

let test_storage = [
  {
    status : [
      {score : 0},
      {world : "Harry Potter"}
    ],
    wand : [
      "not find",
      0
    ],
    box : [
      "not find",
      0,
    ],
    key : [
      "not find",
      0
    ],
    book : [
      "not find",
      0
    ],
    painting : "not find",
    boggart : "lock",
    light_switch : "not find",
    light : "off",
    verbs : [],
    nouns : [],

  }
];


//******************************************Login / Sign up************************************************************************************************

// *** load data from local file  ***
const fs = require('fs');
let myData = null;
//	const express = require('express');
//const router = express.Router();

fs.readFile('database.json', function (err, data) {
	myData = []; // if file does not exist
		//                  -> first run
		//                       -> create an empty array
	if (err) {
		return; //console.error(err);
	} else {
		myData = JSON.parse(data);
	}
});


/* POST home page. */
app.post('/', function(req, res, next) {
	console.log('aaa');
	console.log( req.body.login + ' ' + req.body.password );
	//If login
	if(req.body.login!= undefined && req.body.password != undefined){
	console.log( req.body.login + ' ' + req.body.password );


		let r = myData.filter(e=>{
			return req.body.login == e.login;
		});
		if (r.length==0){ // no login in the db
			res.send('Wrong combinaison  ' +
				'<a href="http://localhost:3000/">Login page</a>' );
		} else {
			let r2 = r.filter(e=>{
				return req.body.password == e.password;
			});
			if(r2.length==0){ //wrong password
				res.send('Wrong combinaison ' +
					'<a href="http://localhost:3000/">back</a>' );
			}else{ //Combinaison ok
				//res.send('<a href="http://localhost:3000/game">game</a>');
        console.log('r2 : '+ r2[0])//io.emit('login', r2);
				res.sendFile('game.html' , { root : __dirname});
        io.sockets.on('connection', function (socket) {
          socket.emit('user', r2[0].login);
          socket.emit('login2', r2[0].storage);
        });
		   }
    }
	//If Sign up
	}else if (req.body.new_login!= undefined && req.body.new_password != undefined){
		console.log( req.body.new_login + ' ' + req.body.new_password );
		let r = myData.filter(e=>{
			return req.body.new_login == e.login;
		});

		if (r.length==0){ // unique userName
			myData.push({'login': req.body.new_login, 'password': req.body.new_password, 'storage': test_storage});
			res.send('You are now in the database and you can login now ' +
				'<a href="http://localhost:3000/">back</a>' );

			fs.writeFile('database.json', JSON.stringify(myData) ,  function(err) {
				if (err) {
					return console.error(err);
				}
				console.log("Data written successfully in the database!");
			});


		} else {
			res.send('This login is already taken ' +
				'<a href="http://localhost:3000/">back</a>' );
		}
	}

});

//*********************************************** Socket ************************************************************************/

io.on('connection', function(socket){


  console.log('a user connected');


  socket.on('maj', function(msg){
  // console.log(msg.login + ' quit the game, storage : ' + msg.storage);
   let r = myData.filter(e=>{
     return msg.login == e.login;
   });
   myData[myData.indexOf(r[0])].storage = JSON.parse(msg.storage);
   fs.writeFile('database.json', JSON.stringify(myData) ,  function(err) {
     if (err) {
       return console.error(err);
     }
     console.log("Data written successfully in the database!");
   });

  });


   socket.on('question', function(msg){
    console.log('Verb : ' + msg.verb +' Noun : '+ msg.noun);
    io.emit('answer', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });


});

//Démarrer seveur

http.listen(3000, function(){
  console.log('listening on port :3000');
});
