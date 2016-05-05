"use strict";

var app = angular.module('tocotter', ['ngCookies', 'ngSocket']);

app.run(function(stream) {
    stream.onOpen(function() {
        console.log('Stream User opened');
    });
});


app.constant('CONFIG', {
    baseUrl: '/api',
    numLoadedTwt: 100,
    numSavedTwt: 100
});