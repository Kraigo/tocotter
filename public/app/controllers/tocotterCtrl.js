"use strict";

app.controller('TocotterCtrl', function($scope, $interval, twitter, timeline, composer){

	$scope.showMenu = false;

	$scope.timelines = timeline.timelines;
	$scope.loading = timeline.status.loading;
	$scope.detailTweets = timeline.detailTweets;
	$scope.detail = timeline.detail;
	$scope.composer = composer;

	
	$scope.refresh = function() {
		timeline.loadTimeline(timeline.timelines);
	};

	$interval($scope.refresh, 60000);

	$scope.uploadMedia = function(file) {
		twitter.postMediaUpload(file).then(function(res) {
			composer.media.push(res.data.media_id_string);
		})
	}

});