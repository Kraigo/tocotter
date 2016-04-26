"use strict";

var app = angular.module('tocotter', ['ngFileUpload', 'ngCookies']);


app.constant('CONFIG', {
    baseUrl: '/api',
    numLoadedTwt: 100,
    numSavedTwt: 100
});