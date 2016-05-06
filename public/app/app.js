"use strict";

var app = angular.module('tocotter', ['ngCookies', 'ngSocket']);

app.run(function($http, $templateCache) {
    $http.get('app/tweet/tweetContent.html', { cache: $templateCache });
});


app.constant('CONFIG', {
    baseUrl: '/api',
    numLoadedTwt: 100,
    numSavedTwt: 100
});