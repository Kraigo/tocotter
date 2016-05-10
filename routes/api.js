var express = require('express');
var router = express.Router();

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var twitterAPI  = require('node-twitter-api');
var config = require('./../config');
var twitter = new twitterAPI(config.twitterAccess);

router.get('/search', function (req, res) {

    return twitter.search(
        req.query,
        req.auth.accessToken,
        req.auth.accessTokenSecret,
        function(error, data, response) {
            if (error) return res.status(error.statusCode).send("Error api GET " + req.params.section + "/" + req.params.action + ":" + JSON.stringify(error));
            res.send(data);
        }
    );

});


router.get('/:section/:action', function (req, res) {

    twitter[req.params.section](
        req.params.action,
        req.query,
        req.auth.accessToken,
        req.auth.accessTokenSecret,
        function(error, data, response) {
            if (error) return res.status(error.statusCode).send("Error api GET " + req.params.section + "/" + req.params.action + ":" + JSON.stringify(error));
            res.send(data);
        }
    );

});


router.post('/upload', multipartyMiddleware, function (req, res) {

    return twitter.uploadMedia(
        {
            media: req.body.media,
            isBase64: true
        },
        req.auth.accessToken,
        req.auth.accessTokenSecret,
        function(error, data, response) {
            if (error) return res.status(error.statusCode).send("Error api GET " + req.params.section + "/" + req.params.action + ":" + JSON.stringify(error));
            res.send(data);
        }
    );

});


router.post('/:section/:action', function (req, res) {

    twitter[req.params.section](
        req.params.action,
        req.body,
        req.auth.accessToken,
        req.auth.accessTokenSecret,
        function(error, data, response) {
            if (error) return res.status(error.statusCode).send("Error api POST " + req.params.section + "/" + req.params.action + ":" + JSON.stringify(error));
            res.send(data);
        }
    );

});


module.exports = router;
