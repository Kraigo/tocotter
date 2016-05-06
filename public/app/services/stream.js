"use strict";

app.service('stream', function(ngSocket){
    var stream = ngSocket('ws://' + window.location.host);
    stream.onOpen(function() {
        console.log('Stream User opened');
    });
    return stream;

});