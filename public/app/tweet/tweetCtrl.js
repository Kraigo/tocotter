app.directive('tctTweet', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/tweet/tweet.html',
        controller: 'TweetCtrl',
        scope: {
            tweet: "=source"
        }
    }
});

app.controller('TweetCtrl', function($scope, twitter, composer, timeline) {
    $scope.reply = function(tweet) {
        composer.reply = tweet;
        composer.isActive = true;
        composer.text = composer.getTweetMentions(tweet);
    };
    $scope.retweet = function(tweet) {
        var tweetId = tweet.retweeted_status? tweet.retweeted_status.id_str : tweet.id_str;
        twitter.postRetweetStatus({id: tweetId}).then(function(res) {
            tweet.retweeted = true;
            timeline.syncTimelinesLocal();
        });
    };

    $scope.favorite = function(tweet) {
        var tweetId = tweet.retweeted_status? tweet.retweeted_status.id_str : tweet.id_str;
        twitter.postFavoriteStatus({id: tweetId}).then(function(res) {
            tweet.favorited = true;
            timeline.syncTimelinesLocal();
        })
    };
    $scope.expand = function(tweet, timelineId) {
        timeline.detail.add(tweet, timelineId);
    };
});