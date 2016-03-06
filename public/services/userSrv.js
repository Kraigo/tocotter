"use strict";

app.service('user', function($q, twitter){
	var self = this;
	self.data = null;
	twitter.getUserShow({user_id: 571038694}).then(function(res) {
		self.data = res;

		var toNext = 1000 - res.statuses_count % 1000;
		if (toNext < 10) {
			alert('To next get ' + toNext +'twts ('+(res.statuses_count + toNext)+')');
		}
	});
});