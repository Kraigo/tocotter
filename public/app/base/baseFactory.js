"use strict";

app.factory('base', function($http, $q, CONFIG){
    return {
        get: function (url, data) {
            return this.request('GET', url, { params: data });
        },

        post: function (url, data) {
            return this.request('POST', url, { data: data });
        },

        file: function(url, file) {
            var fd = new FormData();
            fd.append('media', file);

            return $http.post(CONFIG.baseUrl + url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
            })
            .error(function(){

            });
        },

        request: function (method, url, options, headers) {
            var deferred = $q.defer();
            var self = this;

            options.method = method;
            options.url = CONFIG.baseUrl + url;
            options.headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            };

            if (headers) {
                for(var h in headers) {
                    options.headers[h] = headers[h];
                }
            }

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
