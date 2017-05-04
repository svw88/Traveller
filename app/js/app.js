var app = angular.module('travelerWeb', ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider.when("/", {
		templateUrl : "views/main.html"
	}).when("/login", {
		templateUrl : "views/login.html",
		controller : "MyEventsController"
	}).when("/sign", {
		templateUrl : "views/sign-up.html",
		controller : "LoginDataController"
	}).when("/events", {
		templateUrl : "views/events.html",
		controller : "EventsController"
	}).when("/create", {
		templateUrl : "views/createEvent.html",
		controller : "CreateEventController"
	}).otherwise({
		template : "<h1>Error 404</h1><p>Page does not exist</p>"
	});
});

app.constant("myConfig", {
	"1" : "Club",
	"2" : "Bar"
});

app.factory('userId', function() {
	return {
		userId : " "
	};
});

app.service("TravelerService", function($http) {

	var travelerService = {};

	travelerService.getEvents = function() {

		return $http.get("http://localhost:8327/Service1.svc/events/10/10/10").then(function(data) {

			return data.data;
		});

	};

	travelerService.getMyEvents = function(entry) {

		return $http.get("http://localhost:8327/Service1.svc/myevents/" + entry).then(function(data) {

			return data.data;
		});

	};

	travelerService.create = function(entry) {
		$http({
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json; charset=utf-8'
			},
			url : 'http://localhost:8327/Service1.svc/create',
			data : entry
		});
		console.log(entry);

	};

	travelerService.register = function(entry) {
		$http({
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json; charset=utf-8'
			},
			url : 'http://localhost:8327/Service1.svc/register',
			data : entry
		});
		console.log(entry);

	};

	travelerService.login = function(entry) {

		return $http.get("http://localhost:8327/Service1.svc/login/" + entry.Email + "/" + entry.Password).then(function(data) {

			return data.data;
		});

	};

	return travelerService;

});

app.controller("LoginDataController", ["$scope", "userId", "$routeParams", "$location", "TravelerService",
function($scope, userId, $routeParams, $location, TravelerService) {

	$scope.register = function() {
		TravelerService.register($scope.signUp);
		$location.path("/");
	};

	$scope.login = function() {
		TravelerService.login($scope.signUp).then(function(response) {;
			if (response != "") {
				userId.userId = response;
				$location.path("/login");
			};
		});

	};
}]);

app.controller("EventsController", ["$scope", "userId", "$routeParams", "$location", "TravelerService", "myConfig",
function($scope, userId, $routeParams, $location, TravelerService, myConfig) {

	TravelerService.getEvents().then(function(response) {
		$scope.events = response;
		console.log($scope.events);
	});

	$scope.type = function(typeId) {
		return myConfig[typeId];
	};

}]);

app.controller("MyEventsController", ["$scope", "userId", "$routeParams", "$location", "TravelerService", "myConfig",
function($scope, userId, $routeParams, $location, TravelerService, myConfig) {

	if (userId.userId != " ") {
		TravelerService.getMyEvents(userId.userId).then(function(response) {
			$scope.events = response;
			console.log($scope.events);
		});

		$scope.type = function(typeId) {
			return myConfig[typeId];
		};
	} else {
		$location.path("/");
	};

}]);

app.controller("CreateEventController", ["$scope", "userId", "$routeParams", "$location", "TravelerService", "myConfig",
function($scope, userId, $routeParams, $location, TravelerService, myConfig) {

	$scope.create = function() {

		if (userId.userId != " ") {
			var img = new Image();
			img.src = $scope.event.img;
			img.onload = function() {
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				canvas.width = 150;
				canvas.height = 150;
				ctx.drawImage(img, 5, 5, 150, 150);

				var temp = {
					Name : $scope.event.name,
					Description : "Test",
					Type : 0,
					Date : $scope.event.date,
					Image : canvas.toDataURL("image/png"),
					UserId : userId.userId
				};

				angular.forEach(myConfig, function(v1, k1) {//this is nested angular.forEach loop
					if (v1 == $scope.event.type) {
						temp["Type"] = k1;
					};
				});
				console.log(temp);

				TravelerService.create(temp);
			};

			$location.path("/login");
		};
	};

}]);

app.filter("jsDate", function() {
	return function(x) {
		return new Date(parseInt(x.substr(6)));
	};
});

app.directive("fileread", [
function() {
	return {
		scope : {
			fileread : "="
		},
		link : function(scope, element, attributes) {
			element.bind("change", function(changeEvent) {
				var reader = new FileReader();
				reader.onload = function(loadEvent) {
					scope.$apply(function() {
						scope.fileread = loadEvent.target.result;
					});
				};
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	};
}]);
