var app = angular.module('travelerWeb', ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider.when("/", {
		templateUrl : "views/main.html"
	}).when("/login", {
		templateUrl : "views/login.html",
		controller : "EventsController"
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

app.service("TravelerService", function($http) {

	var travelerService = {};

	travelerService.getEvents = function() {

		return $http.get("http://localhost:8327/Service1.svc/events/10/10/10").then(function(data) {

			return data.data;
		});

	};

	travelerService.save = function(entry) {

		$http.post("data/users.json", entry);
		console.log(entry);

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

	return travelerService;

});

app.controller("LoginDataController", ["$scope", "$routeParams", "$location", "TravelerService",
function($scope, $routeParams, $location, TravelerService) {

	$scope.save = function() {
		TravelerService.save($scope.signUp);
		$location.path("/");
	};

	$scope.login = function() {
		$location.path("/login");
	};
}]);

app.controller("EventsController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig",
function($scope, $routeParams, $location, TravelerService, myConfig) {

	TravelerService.getEvents().then(function(response) {
		$scope.events = response;
		console.log($scope.events);
	});

	$scope.type = function(typeId) {
		return myConfig[typeId];
	};

}]);

app.controller("CreateEventController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig",
function($scope, $routeParams, $location, TravelerService, myConfig) {

	$scope.create = function() {

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
				Image : canvas.toDataURL("image/png")
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
