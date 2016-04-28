'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var cheerio = require('cheerio');

var twitterAPI  = require('node-twitter-api');
var config = require('./config.js');
var twitter = new twitterAPI(config.twitterAccess);

var db = require('./db.js');

//var multiparty = require('connect-multiparty');
//var multipartyMiddleware = multiparty();

var app = express();
app.set('port', (process.env.PORT || 8080));

app.use(bodyParser());
app.use(cookieParser());



//app.use('/api', require('./routes/api'));

// app.post('/api/:section/:action', multipartyMiddleware, function (req, res) {
// 	// console.log('/'+req.params.section+'/'+req.params.action, req.body);

// 	//if (req.body.file) {
//     //
// 	//	console.log(req.body.file);
// 	//	client.post('/media/upload', {media_data: req.body.file}, function(error, media, response){
// 	//		console.log(error);
// 	//		if (!error) {
// 	//			console.log(media.media_id_strin);
// 	//			res.send(media.media_id_string);
// 	//		}
// 	//	});
// 	//} else {
// 		client.post('/'+req.params.section+'/'+req.params.action, req.body, function(error, tweets, response){
// 			if (!error) {
// 				res.send(tweets);
// 			}
// 		});
// 	//}


// });

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
var fs = require('fs');
app.get('/db', function(req, res) {
	fs.readFile('./authorization.db', function (err, data) {
		res.header({'Content-Type': 'application/json'});
		res.send(err || data);
	})
});

app.get('/auth', function (req, res) {

	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){

		if (error) return res.send("Error getting OAuth request token: " + error);
		
		var expires= new Date();		
		expires.setHours(expires.getHours() + 1);		

		res.cookie('requestToken', requestToken, {expires: expires, httpOnly: false, domain: req.hostname});

		db.insert({
			requestToken: requestToken,
			requestTokenSecret: requestTokenSecret,
			expirationDate: expires
		}, function(err, doc) {
			if (err) return res.send("Error insert request token: " + err);

			res.redirect(twitter.getAuthUrl(requestToken));
		});

		

	})

});

app.get('/callback', function (req, res) {

	db.findOne({requestToken: req.cookies.requestToken}, function(err, auth) {

		if (err) return res.send("Error find request token: " + err);

		twitter.getAccessToken(auth.requestToken, auth.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
		
			if (error) return res.send("Error get access token: " + error);

			var expires = new Date();		
			expires.setFullYear(expires.getFullYear() + 10);		

			res.cookie('accessToken', accessToken, {expires: expires, httpOnly: false, domain: req.hostname});

			var dbupdate = {
				$set: {
					accessToken: accessToken,
					accessTokenSecret: accessTokenSecret
				},
				$unset: {
					expirationDate: true
				}
			};

			db.update({ requestToken: req.cookies.requestToken }, dbupdate, {},
				function () {
					res.redirect('/');
				}
			);

		})

	});
	
});


app.use(function(req, res, next) {

	// Authentication

	if (!req.cookies.accessToken) return res.redirect('/auth');

	db.findOne({accessToken: req.cookies.accessToken}, function(err, auth) {

		if (!auth) return res.redirect('/auth');

		req.auth = auth;
		next();
	});
});


app.use(function(req, res, next) {

	// Set user ID

	if (req.cookies.uid) return next();

	twitter.verifyCredentials(req.auth.accessToken, req.auth.accessTokenSecret, function(error, data, response) {
		var expires = new Date();
		expires.setFullYear(expires.getFullYear() + 10);

		res.cookie('uid', data.id_str, {expires: expires, httpOnly: false, domain: req.hostname});

		next();
	});
});


app.use(express.static('public'));


app.get('/api/:section/:action', function (req, res) {

	if (req.params.section === 'search') {
		 return twitter[req.params.section](
			req.query,
			req.auth.accessToken,
			req.auth.accessTokenSecret,
			function(error, data, response) {
				if (error) return res.send("Error api GET " + req.params.section + "/" + req.params.action + ":" + error);
				res.send(data);
			}
		);
	}

	twitter[req.params.section](
		req.params.action,
		req.query,
		req.auth.accessToken,
		req.auth.accessTokenSecret,
		function(error, data, response) {
			if (error) return res.send("Error api GET " + req.params.section + "/" + req.params.action + ":" + error);
			res.send(data);
		}
	);
});

app.post('/api/:section/:action', function (req, res) {
	twitter[req.params.section](
		req.params.action,
		req.body,
		req.auth.accessToken,
		req.auth.accessTokenSecret,
		function(error, data, response) {
			if (error) return res.send("Error api POST " + req.params.section + "/" + req.params.action + ":" + error);
			res.send(data);
		}
	);

});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
});

var server = app.listen(app.get('port'), function () {
	console.log('Tocotter listening :%s', app.get('port'));
	// open('http://localhost:8080');
});

