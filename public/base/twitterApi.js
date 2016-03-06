"use strict";

app.service('twitter', function(base){
	return {
		getHomeTimeline: function(data) {
			return base.get('/statuses/home_timeline', data);
		},
		getUserTimeline: function(data) {
			return base.get('/statuses/user_timeline',  data);
		},
		getMentionsTimeline: function(data) {
			return base.get('/statuses/mentions_timeline',  data);
		},

		getTimeline: function(timelineId, data) {
			if (timelineId == 'home') {
				return this.getHomeTimeline(data);
			} else if (timelineId == 'user') {
				return this.getUserTimeline(data);
			} else if (timelineId == 'mentions') {
				return this.getMentionsTimeline(data);
			}
		},

		getTweet: function(tweetId) {
			return base.get('/statuses/show',  {id: tweetId});
		},

		getUserShow: function(data) {
			return base.get('/users/show', data);
		},

		getConversation: function(username, tweetId) {
			return base.get('/search/tweets', {q: "@"+username, count: 100, since_id: tweetId});
		},

		postUpdateStatus: function(data) {
			return base.post('/statuses/update', data);
		},

		postRetweetStatus: function(data) {
			return base.post('/statuses/retweet', data);
		},
		postFavoriteStatus: function(data) {
			return base.post('/favorites/create', data);
		},

		postMediaUpload: function(data) {
			return base.file('/media/upload', data);
		}
	}
});