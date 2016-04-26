"use strict";

app.directive('tctComposer', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/composer/composer.html',
		controller: 'ComposerCtrl'
	}
});

app.controller('ComposerCtrl', function($scope, twitter, composer, timeline){
	$scope.uploading = false;

	$scope.updateStatus = function() {
		if (composer.text.length == 0 && composer.text.length > 140) return false;

		var params = {status: composer.text};

		if (composer.reply) params.in_reply_to_status_id = composer.reply.id_str;
		if (composer.media[0]) params.media_ids = composer.media;

		$scope.uploading = true;
		twitter.postUpdateStatus(params).then(function(res) {
			$scope.uploading = false;
			composer.emptyComposer();
			timeline.loadTimeline(timeline.timelines);
		});
	};

	$scope.close = function() {
		composer.isActive = false;
		composer.emptyComposer();
	};

	$scope.openComposer = function() {
		composer.isActive = true;
	}
});