"use strict";

app.service('stream', function(ngSocket){
    return ngSocket('ws://' + window.location.host);
});