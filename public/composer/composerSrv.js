"use strict";

app.service('composer', function(user) {
	return {
		isActive: false,
		text: '',
		reply: null,
		inputMedia: null,
		media: [],
		getTweetMentions: function(tweet) {
			var mentions = [tweet.user.screen_name];

			if (tweet.entities.user_mentions) {
				angular.forEach(tweet.entities.user_mentions, function(mention) {
					mentions.push(mention.screen_name);
				});
			}

			mentions = mentions.filter(function(value, index, self) { 
				return self.indexOf(value) === index;
			});

			var indexCurrentUser = mentions.indexOf(user.data.screen_name);
			if (indexCurrentUser >= 0) {
				mentions.splice(indexCurrentUser, 1);
			}

			var result = '';

			angular.forEach(mentions, function(mention) {
				result += '@' + mention + ' ';
			});

			return result;
		},
		emptyComposer: function() {
			this.isActive = false;
			this.text = '';
			this.reply = null;
		}
	}
});

