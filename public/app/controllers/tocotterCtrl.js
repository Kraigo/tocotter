"use strict";

app.controller('TocotterCtrl', function($scope, $interval, twitter, timeline, composer, stream, user){

	$scope.showMenu = false;

	$scope.timelines = timeline.timelines;
	$scope.loading = timeline.status.loading;
	$scope.detailTweets = timeline.detailTweets;
	$scope.detail = timeline.detail;
	$scope.composer = composer;

	stream.onMessage(function(msg) {
		msg = JSON.parse(msg.data);

		if (msg.error) {
			return console.error('Stream error:', msg.message);
		}
		if (msg.created_at && !msg.event) {
			timeline.addTweets('home', msg, true);
		}

		if (msg.user && msg.user.id_str === user.uid) {
			timeline.addTweets('user', msg);
		}

		if (msg.delete) {
			timeline.removeTweets(msg.delete.status);
		}

		//if (msg.event === 'favorite') {
		//	timeline.favoriteTweet(msg.target_object, msg.source.id_str === user.uid);
		//}
	});
	
	$scope.refresh = function() {
		timeline.loadTimeline(timeline.timelines);
	};

	//$interval($scope.refresh, 60000);

	$scope.uploadMedia = function(file) {
		twitter.postMediaUpload(file).then(function(res) {
			composer.media.push(res.data.media_id_string);
		})
	};
});