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
		twitter.postMediaUpload({file: file}).then(function(res) {
			composer.media.push(res.media_id_string);
		}).then(function (resp) {
			console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
		}, function (resp) {
			console.log('Error status: ' + resp.status);
		}, function (evt) {
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		});
	};

});