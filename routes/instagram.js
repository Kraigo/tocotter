var express = require('express');
var router = express.Router();

var instagram = require('instagram-node').instagram();

router.get('/auth', function(req, res) {
    instagram.use({ client_id: process.env.INSTAGRAM_CLIENT,
        client_secret: process.env.INSTAGRAM_SECRET });

    req.hostname = 'localhost:8080';
    var redirecUri = req.protocol+ '://'+'localhost:8080'+'/instagram/callback';

    res.redirect(instagram.get_authorization_url(redirecUri, { scope: ['likes', 'public_content', 'basic'] }));
});
router.get('/callback', function(req, res) {

    instagram.use({ client_id: process.env.INSTAGRAM_CLIENT,
        client_secret: process.env.INSTAGRAM_SECRET });

    req.hostname = 'localhost:8080';
    var redirecUri = req.protocol+ '://'+'localhost:8080'+'/instagram/callback';

    instagram.authorize_user(req.query.code, redirecUri, function(err, result) {
        if (err) {
            console.log(err.body);
            res.send("Didn't work");
        } else {
            console.log('Yay! Access token is ' + result.access_token);
            res.send('You made it!!');
        }
    });
});

router.get('/:madiaid', function(req, res) {
    instagram.use({ access_token: process.env.INSTAGRAM_ACCESS_TOKEN});

    instagram.media(req.params.madiaid, function(err, media, remaining, limit) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(media);
        }

    });
});

module.exports = router;