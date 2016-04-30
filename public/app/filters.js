app.filter('fromNow', function() {
	return function(input) {

		var inputDate = new Date().setTime(Date.parse(input));
		var secodsOffset = (new Date() - inputDate) / 1000;
		secodsOffset = Math.round(secodsOffset);

		if (secodsOffset < 60) {
			return 'Только что'
		} else if (secodsOffset < 3600) {
			return Math.round(secodsOffset / 60) + ' м'
		} else if (secodsOffset < 86400) {
			return Math.round(secodsOffset / 60 / 60) + ' ч'
		} else {
			return Math.round(secodsOffset / 60 / 60 / 24) + ' д'
		}

		// return moment(input).fromNow();
		// var nowDate = new Date();
		// var inputDate = new Date();
		// 	inputDate.setTime(Date.parse(input));
		// return nowDate - inputDate;
	}
})


app.filter('entities', function($sce) {

	return function(tweet) {

		if (!tweet) return;
		
		var result = tweet.text;

		if (!tweet.entities) return;

		if (tweet.entities.hashtags && tweet.entities.hashtags.length > 0) {
			angular.forEach(tweet.entities.hashtags, function(hashtag) {
				result = result.replace('#'+hashtag.text, '<a href="#">#'+hashtag.text+'</a>');
			})
		}

		if (tweet.entities.media && tweet.entities.media.length > 0) {
			angular.forEach(tweet.entities.media, function(media) {				
				result = result.replace(media.url, '<a href="'+media.media_url+'" target="_blank">'+media.display_url+'</a>');
			})
		}

		if (tweet.entities.urls && tweet.entities.urls.length > 0) {
			angular.forEach(tweet.entities.urls, function(url) {				
				result = result.replace(url.url, '<a href="'+url.expanded_url+'" target="_blank">'+url.display_url+'</a>');
			})
		}

		if (tweet.entities.user_mentions && tweet.entities.user_mentions.length > 0) {
			angular.forEach(tweet.entities.user_mentions, function(mention) {				
				result = result.replace('@'+mention.screen_name, '<a href="#">@'+mention.screen_name+'</a>');
			})
		}

		return $sce.trustAsHtml(result);
	}
});


app.filter('video', function() {
	return function(media) {

		switch (media.type) {

			case 'animated_gif':
				var reg = /tweet_video_thumb\/(.*?)\.jpg/i;
				return media.media_url.replace(reg, 'tweet_video/$1.mp4');

			case 'video':
				return media.video_info.variants
					.filter(function(a) {return a.content_type === 'video/mp4'})
					.sort(function(a,b) {return a.bitrate - b.bitrate})
					[0].url;

			default:
				return '';
		}
	}
});