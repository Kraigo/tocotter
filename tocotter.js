var Twitter = require('twitter');
var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');

var open = require('open');

var app = express();

app.use(bodyParser());
app.use(express.static('public'));

// app.use(busboy());


var client = new Twitter(config.twitterAccess);

app.get('/api/:section/:action', function (req, res) {
	client.get('/'+req.params.section+'/'+req.params.action, req.query, function(error, tweets, response){
		if (!error) {
			res.send(tweets);
		}
	});	
});

app.post('/api/:section/:action', function (req, res) {
	// console.log('/'+req.params.section+'/'+req.params.action, req.body);
	console.log(req.files);
	client.post('/'+req.params.section+'/'+req.params.action, req.body, function(error, tweets, response){
		if (!error) {
			res.send(tweets);
		}
	});	
});

var server = app.listen(8080, function () {
	console.log('Tocotter listening :8080');
	open('http://localhost:8080');
});