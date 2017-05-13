var app = angular.module('travelerWeb', ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider.when("/", {
		templateUrl : "views/main.html",
		controller : "MainController"
	}).when("/login", {
		templateUrl : "views/login.html",
		controller : "MyEventsController"
	}).when("/sign", {
		templateUrl : "views/sign-up.html",
		controller : "LoginDataController"
	}).when("/events/:country/:state/:city", {
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

	travelerService.getEvents = function(entry) {

		return $http.get("http://localhost:8327/Service1.svc/events/" + entry.country + "/" + entry.state + "/" + entry.city).then(function(data) {

			return data.data;
		});

	};

	travelerService.getMyEvents = function(entry) {

		return $http.get("http://localhost:8327/Service1.svc/myevents/" + entry).then(function(data) {

			return data.data;
		});

	};

	travelerService.getCountries = function() {

		return $http.get("http://localhost:8327/Service1.svc/countries").then(function(data) {

			return data.data;
		});

	};

	travelerService.getStates = function(entry) {

		return $http.get("http://localhost:8327/Service1.svc/states/" + entry).then(function(data) {

			return data.data;
		});

	};

	travelerService.getCities = function(entry) {

		return $http.get("http://localhost:8327/Service1.svc/cities/" + entry).then(function(data) {

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

app.controller("MainController", ["$scope", "$routeParams", "$location", "TravelerService",
function($scope, $routeParams, $location, TravelerService) {

	TravelerService.getCountries().then(function(response) {
		$scope.countries = response;
	});

	$scope.getStates = function() {
		TravelerService.getStates($scope.country).then(function(response) {
			$scope.states = response;
		});
	};

	$scope.getCities = function() {
		TravelerService.getCities($scope.state).then(function(response) {
			$scope.cities = response;
		});
	};

	$scope.search = function() {
		$location.path("/events/" + $scope.country + "/" + $scope.state + "/" + $scope.city);
	};

}]);

app.controller("EventsController", ["$scope", "userId", "$routeParams", "$location", "TravelerService", "myConfig",
function($scope, userId, $routeParams, $location, TravelerService, myConfig) {

	TravelerService.getEvents($routeParams).then(function(response) {
		$scope.events = response;
		console.log($scope.events);
	});

	$scope.type = function(typeId) {
		return myConfig[typeId];
	};
	
	$scope.city = $routeParams.city;

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

	TravelerService.getCountries().then(function(response) {
		$scope.countries = response;
	});

	$scope.getStates = function() {
		TravelerService.getStates($scope.event.country).then(function(response) {
			$scope.states = response;
		});
	};

	$scope.getCities = function() {
		TravelerService.getCities($scope.event.state).then(function(response) {
			$scope.cities = response;
		});
	};
	$scope.create = function() {

		if (userId.userId != " ") {
			var img = new Image();
			img.src = $scope.event.img;
			img.onload = function() {
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				canvas.width = 300;
				canvas.height = 400;
				ctx.drawImage(img, 5, 5, 300, 400);

				var temp = {
					Name : $scope.event.name,
					Description : $scope.event.description,
					Type : 0,
					Price : $scope.event.price,
					Currency : $scope.event.currency,
					Country : $scope.event.country,
					State : $scope.event.state,
					City : $scope.event.city,
					Site : $scope.event.site,
					Date : $scope.event.date + " " + $scope.event.time,
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

app.directive("dateget", [
function() {
	return {
		scope : {
			dateget : "="
		},
		link : function(scope, element, attributes) {
			element.on("focusout", function() {
				scope.dateget = $(this).val();
			});
		}
	};
}]);

