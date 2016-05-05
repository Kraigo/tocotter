"use strict";

app.controller('TocotterCtrl', function($scope, $interval, twitter, timeline, composer, stream){

	$scope.showMenu = false;

	$scope.timelines = timeline.timelines;
	$scope.loading = timeline.status.loading;
	$scope.detailTweets = timeline.detailTweets;
	$scope.detail = timeline.detail;
	$scope.composer = composer;

	var homeTimeline = $scope.timelines[0];

	stream.onMessage(function(msg) {
		msg = JSON.parse(msg.data);
		if (msg.created_at && homeTimeline.isUnique(msg)) {
			homeTimeline.addTweet(msg);
			homeTimeline.data = homeTimeline.data.splice(0, 100);
		}

		if (msg.delete) {
			homeTimeline.removeTweet(msg.delete.status);
		}
	});
	
	$scope.refresh = function() {
		timeline.loadTimeline(timeline.timelines);
	};

	//$interval($scope.refresh, 60000);

	$scope.uploadMedia = function(file) {
		twitter.postMediaUpload(file).then(function(res) {
			composer.media.push(res.data.media_id_string);
		})
	}

});