
app.directive("tctFileRead", function () {
	return {
		scope: {
			tctFileRead: "="
		},
		link: function (scope, element, attrs) {
			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.tctFileRead(loadEvent.target.result.split(',')[1]);
					});
				};
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	};
});

app.directive('tctRepeatFinish', function(timeline) {
	return function(scope, element, attrs) {
			if (scope.$last){
				setTimeout(timeline.restorePosition);
			}
	};
})

app.directive("tctSavePosition", function (timeline) {
	return function(scope, element, attrs) {
		angular.element(element).bind("scroll", function() {
			var column = this;
			var columntTop = column.scrollTop;
			var elements = column.querySelectorAll('.tweet-container');

			for (var i in elements) {
				if (elements[i].offsetTop > columntTop) {
					timeline.savePosition(elements[i].id);
					break;
				}			 
			}
		});
	};
});


app.directive("shortClick", function(){
	return {
		restrict: "A",
		link: function(scope, element, attr){
			scope.time = null;

			element.on("mousedown mouseup", function(e){

				if(e.type == "mousedown" && e.button === 0){
					scope.time= Date.now();
				}

				if(e.type == "mouseup" && e.button === 0 && e.target.nodeName !== 'BUTTON' && e.target.nodeName !== 'A'&& e.target.nodeName !== 'IMG'){
					if(Date.now() - scope.time > 200){
						return false;
					} else {
						scope.$eval(attr.shortClick);
					}
				}
			});
		}
	}
});

app.directive('focusMe', function($timeout) {
	return {
		scope: {
			trigger: '=focusMe'
		},
		link: function(scope, element) {
			scope.$watch('trigger', function(value) {
				if(!!value) {
					$timeout(function() {element[0].focus();}, 100);
				}
			});
		}
	};
});

app.directive('vsrc', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			attr.$set('src', attr.vsrc);
		}
	}
});


app.directive('tctMedia', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<img ng-src="{{url}}" ng-if="show">',
		link: function(scope, element, attr) {
			scope.url = scope.$eval(attr.src);
			scope.show = false;

			var regsMedia = [
				{reg: /imgur\.com\/(\w*)/, rep: 'i.imgur.com/$1.jpg'}
			];
			for (var i=0; i < regsMedia.length; i++) {
				if (regsMedia[i].reg.test(scope.url)) {
					scope.url = scope.url.replace(regsMedia[i].reg, regsMedia[i].rep);
					scope.show = true;
					break;
				}
			}

		}
	}
});