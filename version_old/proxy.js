var redis = require('redis')

var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();
var client = redis.createClient(6379, '127.0.0.1', {})

//
// Create your server that makes an operation that waits a while
// and then proxies the request
//


http.createServer(function (req, res) {

  var target;
  // client.rpoplpush("servers","servers", function(err, reply) {
		client.lindex("servers",0, function(err, reply) {
			// console.log('Current server is:');
			// console.log(reply); // Returns the list. Refer: CLI client.
			// // res.send(reply);
      target = 'http://' + reply;
      console.log('Target is: %s', target);

      proxy.web(req, res, {
        target: target
      });

		});
	// })

}).listen(5000);
