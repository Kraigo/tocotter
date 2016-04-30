"use strict";

app.factory('base', function($http, $q, CONFIG, Upload){
    return {
        getHeaders: function (url) {
            var header = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            };
            return header;
        },

        get: function (url, data) {
            return this.request('GET', url, { params: data });
        },

        post: function (url, data) {
            return this.request('POST', url, { data: data });
        },

        file: function(url, data) {
            return Upload.upload({
                url: CONFIG.baseUrl + url,
                data: data
            });
        },

        request: function (method, url, options) {
            var deferred = $q.defer();
            var self = this;

            options.method = method;
            options.url = CONFIG.baseUrl + url;
            options.headers = this.getHeaders(url);

            $http(options)
                .success(function (result, status) {
                    deferred.resolve(result);
                })
                .error(function (err, status) {
                    self.showError(err, status);
                    deferred.reject();
                });

            return deferred.promise;
        },

        showError: function (err, status) {
            console.log(err, status);
        }
    }
});
