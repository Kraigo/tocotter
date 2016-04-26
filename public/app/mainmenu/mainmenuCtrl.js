"use strict";

app.directive('tctMainMenu', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'app/mainmenu/mainmenu.html',
		controller: 'MainmenuCtrl'
	}
});

app.controller('MainmenuCtrl', function($scope, user){
	$scope.user = user;
});