"use strict";

var app = angular.module('tocotter', ['ngFileUpload']);


app.constant('CONFIG', {
    baseUrl: '/api',
    numLoadedTwt: 100,
    numSavedTwt: 100
});