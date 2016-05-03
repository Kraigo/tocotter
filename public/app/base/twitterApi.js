"use strict";

app.service('twitter', function(base){
	return {
		getHomeTimeline: function(data) {
			return base.get('/getTimeline/home', data);
		},
		getUserTimeline: function(data) {
			return base.get('/getTimeline/user',  data);
		},
		getMentionsTimeline: function(data) {
			return base.get('/getTimeline/mentions',  data);
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
			return base.get('/search', {q: "@"+username, count: 100, since_id: tweetId});
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

		postMediaUpload: function(file) {
			return base.file('/upload', file);
		}
	}
});