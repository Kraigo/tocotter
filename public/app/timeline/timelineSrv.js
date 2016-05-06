"use strict";

app.service('timeline', function($cookies, twitter, CONFIG) {
	var self = this;

	self.status = {
		loading: [],
		startLoading: function(item) {
			if (this.loading.indexOf(item) < 0) {
				this.loading.push(item);
			}
		},
		endLoading: function(item) {
			var index = this.loading.indexOf(item);
			this.loading.splice(index, 1);
		}
	};
	self.timelines = [
		new Timeline('home', twitter),
		new Timeline('mentions', twitter),
		new Timeline('user', twitter)
	];

	self.loadTimeline = function(timelines) {
		angular.forEach(timelines, function(timeline) {	
			timeline.data[0]
				? self.loadTimelineData(timeline, {since_id: timeline.data[0].id_str, user_id: $cookies.get('uid')})
				: self.loadTimelineData(timeline, {count: CONFIG.numLoadedTwt, user_id: $cookies.get('uid')});
		});
	};

	self.loadTimelineData = function(timeline, params) {

		self.status.startLoading(timeline.id);

		twitter.getTimeline(timeline.id, params).then(function(res) {

			self.addTweets(timeline.id, res);

		});

	};

	self.loadFromLocal = function(timelines) {
		angular.forEach(timelines, function(timeline) {
			if (localStorage[timeline.id]) {
				timeline.data = JSON.parse(localStorage[timeline.id]);
			}
		});
	};

	self.saveToLocal = function(timeline) {
		localStorage[timeline.id] = JSON.stringify(timeline.data);
	};

	self.syncTimelinesLocal = function() {
		angular.forEach(self.timelines, function(timeline) {
			self.saveToLocal(timeline);
		})
	};

	self.lastPosition = function() {
		return localStorage['lastPosition'];
	};

	self.savePosition = function(tweetId) {
		if (self.lastPosition() != tweetId) {
			localStorage['lastPosition'] = tweetId;
		}		
	};

	self.restorePosition = function() {
		var column = document.querySelector('#timeline-home .column');
		var element = document.querySelector('#'+self.lastPosition());
		column.scrollTop = element.offsetTop - element.offsetHeight;

	};

	self.addTweets = function(timelineId, tweets) {

		tweets = Array.isArray(tweets) ? tweets : [tweets];

		var timeline  = self.getTimelineById(timelineId);

		for (var i = tweets.length-1; i >= 0; i--) {
			timeline.addTweet(tweets[i]);
		}

		timeline.data = timeline.data.splice(0, CONFIG.numSavedTwt);
		self.saveToLocal(timeline);
		self.status.endLoading(timeline.id);
	};

	self.removeTweets = function(tweets) {

		tweets = Array.isArray(tweets) ? tweets : [tweets];

		for (var t = tweets.length -1; t >=0; t--) {
			for (var i = self.timelines.length - 1; i >= 0; i--) {
				self.timelines[i].removeTweet(tweets[t]);
			}
		}
	};

	self.getTimelineById = function(timelineId) {
		for (var i = self.timelines.length - 1; i >= 0; i--) {
			if (self.timelines[i].id === timelineId) {
				return self.timelines[i];
			}
		}
		return null;
	};


	var initTimelines = function() {
		self.loadFromLocal(self.timelines);
		// self.restorePosition();
		// self.loadTimeline(self.timelines);
	}();

});


function Timeline(id, twitter) {
	this.id = id;
	this.data = [];
	this.detailData = [];
	this.showDetail = false;
	this.twitter = twitter;
}

Timeline.prototype = {
	addDetail: function(tweet) {
		if (!tweet) { this.remove(); }

		var self = this;

		this.detailData = [];
		this.detailData.push(tweet);
		this.showDetail = true;

		this.getRepliedTweet(tweet);

		this.twitter.getConversation(tweet.user.screen_name, tweet.id_str).then(function(res) {
			for (var i in res.statuses) {
				var tweet = res.statuses[i];
				if (self.detailData[0].id_str == tweet.in_reply_to_status_id_str) {
					self.detailData.push(tweet)
				}
			}
		})
	},
	removeDetail: function() {
		this.detailData = [];
		this.showDetail = false;
	},
	getRepliedTweet: function(tweet) {;
		var self = this;
		if (tweet.in_reply_to_status_id_str) {				
			this.twitter.getTweet(tweet.in_reply_to_status_id_str).then(function(res) {
				self.detailData.unshift(res);
				self.getRepliedTweet(res);
			})
		}
	},
	addTweet: function(elm) {
		if (this.isUnique(elm)) {
			this.data.unshift(elm);
		}
	},
	removeTweet: function(status) {
		for (var i=0; i < this.data.length; i++) {
			if (this.data[i].id_str === status.id_str) {
				this.data.splice(i, 1);
			}
		}

	},
	isUnique: function(elm) {
		
		var unique = true;

		this.data.forEach(function(a) {
			if (a.id_str === elm.id_str) {
				unique = false;
			}
		});

		return unique;
	}
};