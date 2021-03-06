'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var cheerio = require('cheerio');

var twitterAPI  = require('node-twitter-api');
var config = require('./config.js');
var twitter = new twitterAPI(config.twitterAccess);

var Tokens = require('./tokens.js');

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

app.get('/db', function(req, res) {
	Tokens.findAll().then(function(tokens) {
		res.send(tokens);
	})
});

app.get('/auth', function (req, res) {

	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){

		if (error) return res.send("Error getting OAuth request token: " + JSON.stringify(error));

		var expires= new Date();
		expires.setHours(expires.getHours() + 1);

		res.cookie('requestToken', requestToken, {expires: expires, httpOnly: false, domain: req.hostname});

		Tokens.create({
			requestToken: requestToken,
			requestTokenSecret: requestTokenSecret
		}).then(function() {
			res.redirect(twitter.getAuthUrl(requestToken));
		});

	})

});

app.get('/callback', function (req, res) {

	Tokens.findOne({where:{requestToken: req.cookies.requestToken}}).then(function(token) {

		if (!token) return res.send("Error find request token");

		var auth = token.dataValues;

		twitter.getAccessToken(auth.requestToken, auth.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {

			if (error) return res.send("Error get access token: " + JSON.stringify(error));

			var expires = new Date();
			expires.setFullYear(expires.getFullYear() + 10);

			res.cookie('accessToken', accessToken, {expires: expires, httpOnly: false, domain: req.hostname});

			Tokens.findOne({where: { requestToken: req.cookies.requestToken }})
				.then(function(token) {
					return token.update({
						accessToken: accessToken,
						accessTokenSecret: accessTokenSecret
					})
				}).then(function(token) {
					res.redirect('/');
				});

		})

	});

});


app.use(function(req, res, next) {

	// Authentication

	if (!req.cookies.accessToken) return res.redirect('/auth');

	Tokens.findOne({where: {accessToken: req.cookies.accessToken}}).then(function(token) {

		if (!token) return res.redirect('/auth');

		var auth = token.dataValues;

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

app.use('/api', require('./routes/api'));

app.use('/instagram', require('./routes/instagram'));


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
});

var wss = require('./routes/stream')(server);