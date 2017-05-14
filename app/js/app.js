var app = angular.module('travelerWeb', ["ngRoute", "ngGeolocation"]);

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
	}).when("/events/:country/:state/:city/:id", {
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

app.service("TravelerService", function($http, $window) {

	var travelerService = {};

	travelerService.getEvents = function(entry) {

		return $http.get("http://localhost:8327/Service1.svc/events/" + entry.country + "/" + entry.state + "/" + entry.city + "/" + entry.id).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
				City:	'', 
				Country: '',
				Currency: '',
				Date:'/Date(1495922400000-0300)/',
				Description: '', 
				Id: -1, 
				Image:'0x', 
				Name : 'No More Events',
				Price: 0,
				Site: '', 
				State: '', 
				Type: 1,
				UserId:" "

			}];
			};
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
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					Name : entry
				}];
			};

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

	travelerService.location = function(entry) {

		return $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + entry.latitude + "," + entry.longitude + "&sensor=true").then(function(data) {
			return data.data.results[0].address_components;
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

app.controller("MainController", ["$scope", "$routeParams", "$location", "TravelerService", "$geolocation", "userId", "$route",
function($scope, $routeParams, $location, TravelerService, ngGeolocation, userId, $route) {
	$scope.id = userId.userId;
	console.log($scope.id);
	ngGeolocation.getCurrentPosition().then(function(position) {
		TravelerService.location(position.coords).then(function(response) {
			$scope.location = response;
		}).then(TravelerService.getCountries().then(function(response) {
			$scope.countries = response;
		}).then(function() {
			$scope.countries.splice(0, 0, {
				Name : $scope.location[6].long_name
			});
			$scope.country = $scope.countries[0];
			$scope.states = [{
				Name : $scope.location[5].long_name
			}];
			$scope.state = $scope.states[0];
			$scope.cities = [{
				Name : $scope.location[4].long_name
			}];
			$scope.city = $scope.cities[0];
		}));
	});

	$scope.getStates = function() {
		TravelerService.getStates($scope.country.Name).then(function(response) {
			$scope.states = response;
			$scope.state = $scope.states[0];
			TravelerService.getCities($scope.state.Name).then(function(response) {
				$scope.cities = response;
				$scope.city = $scope.cities[0];
			});
		});
	};

	$scope.getCities = function() {
		TravelerService.getCities($scope.state.Name).then(function(response) {
			$scope.cities = response;
			$scope.city = $scope.cities[0];
		});
	};

	$scope.search = function() {
		$location.path("/events/" + $scope.country.Name + "/" + $scope.state.Name + "/" + $scope.city.Name + "/" + -1);
	};

	$scope.logout = function() {
		userId.userId = " ";
		$route.reload();
	};

}]);

app.controller("EventsController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "userId", "$window",
function($scope, $routeParams, $location, TravelerService, myConfig, userId, $window) {
	$scope.id = userId.userId;

	TravelerService.getEvents($routeParams).then(function(response) {
		$scope.events = response;
		console.log($scope.events);
	});

	$scope.type = function(typeId) {
		return myConfig[typeId];
	};

	$scope.city = $routeParams.city;

	$scope.logout = function() {
		userId.userId = " ";
	};

	$scope.next = function() {
		$location.path("/events/" + $routeParams.country + "/" + $routeParams.state + "/" + $routeParams.city + "/" + $scope.events[($scope.events.length - 1)].Id);
	};

	$scope.prev = function() {
			$window.history.back();
	};

}]);

app.controller("MyEventsController", ["$scope", "userId", "$routeParams", "$location", "TravelerService", "myConfig", "$route",
function($scope, userId, $routeParams, $location, TravelerService, myConfig, $route) {

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

	$scope.logout = function() {
		userId.userId = " ";
	};

	$scope.refresh = function() {
		$route.reload();
	};

}]);

app.controller("CreateEventController", ["$scope", "userId", "$routeParams", "$location", "TravelerService", "myConfig", "$geolocation",
function($scope, userId, $routeParams, $location, TravelerService, myConfig, ngGeolocation) {

	ngGeolocation.getCurrentPosition().then(function(position) {
		TravelerService.location(position.coords).then(function(response) {
			$scope.location = response;
		}).then(TravelerService.getCountries().then(function(response) {
			$scope.countries = response;
		}).then(function() {
			$scope.countries.splice(0, 0, {
				Name : $scope.location[6].long_name
			});
			$scope.country = $scope.countries[0];
			$scope.states = [{
				Name : $scope.location[5].long_name
			}];
			$scope.state = $scope.states[0];
			$scope.cities = [{
				Name : $scope.location[4].long_name
			}];
			$scope.city = $scope.cities[0];
		}));
	});

	$scope.getStates = function() {
		TravelerService.getStates($scope.country.Name).then(function(response) {
			$scope.states = response;
			$scope.state = $scope.states[0];
			TravelerService.getCities($scope.state.Name).then(function(response) {
				$scope.cities = response;
				$scope.city = $scope.cities[0];
			});
		});
	};

	$scope.getCities = function() {
		TravelerService.getCities($scope.state.Name).then(function(response) {
			$scope.cities = response;
			$scope.city = $scope.cities[0];
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
					Country : $scope.country.Name,
					State : $scope.state.Name,
					City : $scope.city.Name,
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

				TravelerService.create(temp).then();
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

