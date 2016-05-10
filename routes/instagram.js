var express = require('express');
var router = express.Router();

var instagram = require('instagram-node').instagram();

instagram.use({ client_id: process.env.INSTAGRAM_CLIENT,
    client_secret: process.env.INSTAGRAM_SECRET });

router.get('/callback', function(req, res) {
    instagram.media(req.params.madiaid, function(err, media, remaining, limit) {
        res.send(media)
    });
});

router.get('/:madiaid', function(req, res) {
    instagram.media(req.params.madiaid, function(err, media, remaining, limit) {
        res.send(media)
    });
});

module.exports = router;