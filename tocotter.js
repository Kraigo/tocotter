var Twitter = require('twitter');
var express = require('express');
//var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio')

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var config = require('./config');

var open = require('open');

var app = express();

//app.use(bodyParser());
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

app.post('/api/:section/:action', multipartyMiddleware, function (req, res) {
	// console.log('/'+req.params.section+'/'+req.params.action, req.body);
	console.log(req.files);
	client.post('/'+req.params.section+'/'+req.params.action, req.body, function(error, tweets, response){
		if (!error) {
			res.send(tweets);
		}
	});	
});

//app.get('/request/:link', function(req, res) {
//	var options = {
//		url: req.params.link,
//		headers: {
//			'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
//		}
//	};
//	request(options, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			var $ = cheerio.load(body);
//			var srcAttr = $('#pImage_0').attr('src');
//			console.log(body);
//			res.send(srcAttr);
//		}
//	})
//});
//
//app.get('/link/:link', function(req, res) {
//	request(req.params.link, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			res.send(response);
//		}
//	})
//});

var server = app.listen(8080, function () {
	console.log('Tocotter listening :8080');
	open('http://localhost:8080');
});