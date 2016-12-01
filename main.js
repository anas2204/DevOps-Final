var redis = require('redis')
var multer  = require('multer')

var express = require('express')

var fs      = require('fs')

var app = express()
var bodyParser = require('body-parser');

var upload = multer({ dest: 'uploads/' })


// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

var dict = {};

var port = 8080;

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{
	console.log(req.method, req.url);

	// ... INSERT HERE.

	// Used to push a web-page to the list.
	client.lpush('webpage',req.url, function(err, reply){
		console.log(reply); // It will be the size of the list. Refer to lpush in
		// cli client for more info.
	});

	client.ltrim("webpage",0,5);
	// client.lrange("webpage",0,-1, function(err, reply) {
	// 	console.log(reply); // Returns the list. Refer: CLI client.
	// })

	// Next server which will handle the request is:
	// client.rpoplpush("servers","servers", function(err, reply) {
	// 	client.lindex("servers",0, function(err, reply) {
	// 		console.log('Current server is:');
	// 		console.log(reply); // Returns the list. Refer: CLI client.
	// 		res.send(reply);
	// 	});
	// })

	next(); // Passing the request to the next handler in the stack.
});


app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
  //  console.log(req.body) // form fields
   console.log(req.files) // form files

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		// console.log(img);
				client.rpush('images',img, function(err, reply) {
					// console.log(reply);
				});
		});
	}

   res.status(204).end()
}]);

app.get('/meow', function(req, res) {
{
		// console.log(req);
		// console.log(res);

		// if (err) throw err
		res.writeHead(200, {'content-type':'text/html'});
		// var items = [];
		client.rpop('images', function(err, reply) {
			res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+reply+"'/>");
			res.end();
		});


		// client.lrange('images',0,-1, function(err, reply) {
		//
		// 	var imagedata =
		// 	res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
		//
		//
		// 	reply.forEach(function (imagedata)
		// 	{
	  //  		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
		// 	});
	  //  	res.end();
		// });
		// console.log(items);
	// 	console.log(items);

	}
})

// Route creation
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Handle Post request from index.html file
app.post('/process-set-dict', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      key:req.body.key,
      value:req.body.value,
			exp:req.body.exp
   };
   console.log(response);


	 var key = req.body.key;
	 var value = req.body.value;
	 var exp = req.body.exp;



	 client.set(key,value);
	 if (exp && !isNaN(exp)) {
		  client.expire(key,exp);
	 } else {
		 console.log('No expiration')
	 }
	 res.send('Key saved successfully.');
})

app.post('/process-get-dict', urlencodedParser, function (req, res) {
   var key = req.body.key;
	 client.get(key,function(error, value) {
		 if(error) {
			 console.log('Error in key');
		 } else {
			 if(value == null) {
				 res.send('Key undefined.');
			 } else {
				 res.send(value);
				 console.log(value);
			 }

		 }

		//  res.end();
	 })
})

app.get('/get-key-value', function(req, res) {

	var key = req.body.key;
	res.send('Value is: ' + client.get(key));

})
// Trial
// app.get('/bhargav', function(request, response) {
//     // console.log(request);
//     response.send('Hello');
// })

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

app.get('/set-dict', function(req, res) {
	res.sendFile(__dirname + '/set-dict.html');
})

app.get('/get-dict',function(req, res) {
	res.sendFile(__dirname + '/get-dict.html');
})

app.get('/recent',function(req, res) {
	client.lrange("webpage",1,-1, function(err, reply) {
		console.log(reply); // Returns the list. Refer: CLI client.
		res.send(reply);
	});
});

app.get('/list-servers',function(req, res) {
	client.lrange("servers",0,-1, function(err, reply) {
		console.log(reply); // Returns the list. Refer: CLI client.
		res.send(reply);
	});
});

app.get('/spawn',function(req, res) {
	res.sendFile(__dirname + '/spawn.html');
})

// HTTP SERVER
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port);
	// console.log(port ++);
	// console.log(port);
	// port = port + 1;
	console.log(port);

	// client.lpush('servers',host.toString() + ':' + port , function(err, reply){
	// 	// console.log(reply); // It will be the size of the list. Refer to lpush in
	// 	// cli client for more info.
	// });
	// Used to push a web-page to the list.
	client.lpush('servers',port, function(err, reply){
		// console.log(reply); // It will be the size of the list. Refer to lpush in
		// cli client for more info.
	});
	dict[port] = server;


})

app.get('/destroy', function(req, res) {



		// Randomly generate a number of the list server size.
		// Find the port number at that index.

		// Get the server object reference from the dictionary.
		// Cose the server.

		console.log('Currently in destroy');

		var num_servers;
		client.llen('servers', function(err, ans) {
			num_servers = ans;
			// console.log('Length is');
			// console.log(num_servers);

			if(num_servers == 1) {
				res.send(' There is only one server running. It cannot be closed.');
			} else {
				var random = parseInt(getRandom(1, num_servers));
				console.log('random number is:');
				console.log(random);


				// Find the port at this random index.
				client.lindex('servers', random, function(err, ans) {
						var port = ans;

						console.log('Server port is:');
						console.log(port);

						// Remove the redis-list entry.
						client.lrem('servers',1,port, function(req, ans) {

							// Close the server running at this port.
							var server_to_close = dict[port];

							server_to_close.close();

							console.log('Port to close is %s', port);
							res.send('Server is closed now.');
						});
			   });
		}


			// console.log('Random number is:');
			// console.log(random);



		});



		// server.close(function() { console.log('Doh :('); });


})

app.post('/process-spawn-server',urlencodedParser, function(req,res) {

		console.log('Server port is:');
		console.log(port);
		port = port + 1;
		console.log(port);
		// var port =
		// HTTP SERVER
		var new_server = app.listen(port, function () {

		  var host = new_server.address().address;
		  var port = new_server.address().port;

		  console.log('Example app listening at http://%s:%s', host, port);
			res.send('New server is up and running... Enjoy!!!');

			// Used to push a web-page to the list.
			client.lpush('servers',port, function(err, reply){
				// console.log(reply); // It will be the size of the list. Refer to lpush in
				// cli client for more info.
			});

			dict[port] = new_server;
	})

})

// Returns a random number between min (inclusive) and max (exclusive)
function getRandom(min, max) {
	var val = Math.random() * (max - min) + min;
	// console.log('random value is:');
	// console.log(val);
  return val;
}
