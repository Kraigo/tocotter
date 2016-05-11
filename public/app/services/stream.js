"use strict";

app.service('stream', function(ngSocket){
    var protocol = location.protocol.indexOf('https') >= 0 ? 'wss' : 'ws';
    var stream = ngSocket(protocol + '://' + window.location.host);
    stream.onOpen(function() {
        console.log('Stream User opened');
    });
    return stream;

});