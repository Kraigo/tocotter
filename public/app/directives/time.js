app.filter('fromNow', function() {
    return function(date) {

        var inputDate = new Date().setTime(Date.parse(date));
        var secodsOffset = Math.round((new Date() - inputDate) / 1000);
        
        if (secodsOffset < 60) {
            return 'Только что'
        } else if (secodsOffset < 3600) {
            return Math.round(secodsOffset / 60) + ' м'
        } else if (secodsOffset < 86400) {
            return Math.round(secodsOffset / 60 / 60) + ' ч'
        } else {
            return Math.round(secodsOffset / 60 / 60 / 24) + ' д'
        }
    }
});

app.directive('time',
    ['$timeout', '$filter', function($timeout, $filter) {
        return function(scope, element, attrs) {
            var time = scope.$eval(attrs.time);
            var intervalLength = 1000 * 60;
            var timer;

            function updateTime() {
                element.text($filter('fromNow')(time));
            }

            function updateLater() {
                timer = $timeout(function() {
                    updateTime();
                    updateLater();
                }, intervalLength);
            }

            element.bind('$destroy', function() {
                $timeout.cancel(timer);
            });

            updateTime();
            updateLater();
        };
    }]
);