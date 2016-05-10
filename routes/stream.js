var WebSocketServer = require("ws").Server;
var Tokens = require('./../tokens.js');
var twitterAPI  = require('node-twitter-api');
var config = require('./../config');
var twitter = new twitterAPI(config.twitterAccess);

function runWebSocketServer (server) {
    var wss = new WebSocketServer({server: server});

    wss.on("connection", function (ws) {

        var cookies = ws.upgradeReq.headers.cookie
            .split(' ')
            .reduce(function (result, current) {
                var item = current.match(/(.*?)=(.*?);?$/);
                result[item[1]] = item[2];
                return result;
            }, {});

        Tokens.findOne({where: {accessToken: cookies.accessToken}}).then(function (token) {

            if (!token) return;

            twitter.getStream(
                'user',
                {},
                token.accessToken,
                token.accessTokenSecret,
                function (err, data) {
                    if (err) ws.send(JSON.stringify(err), function () {

                    });

                    ws.send(JSON.stringify(data), function () {

                    });
                }, function (err) {
                    if (err) ws.send(err);
                }
            );
        });

        ws.on("close", function () {

        })
    });
    return wss;
}

module.exports = runWebSocketServer;