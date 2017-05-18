var app = angular.module('travelerWeb', ["ngRoute", "ngGeolocation"]);

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider.when("/", {
		templateUrl : "views/main.html",
		controller : "MainController"
	}).when("/login", {
		templateUrl : "views/myEvents.html",
		controller : "MyEventsController"
	}).when("/sign", {
		templateUrl : "views/login.html",
		controller : "LoginDataController"
	}).when("/register", {
		templateUrl : "views/signUp.html",
		controller : "LoginDataController"
	}).when("/events/:country/:state/:city/:id/:types/:find", {
		templateUrl : "views/events.html",
		controller : "EventsController"
	}).when("/user/:alias", {
		templateUrl : "views/userEvents.html",
		controller : "UserEventsController"
	}).when("/create", {
		templateUrl : "views/createEvent.html",
		controller : "CreateEventController"
	}).otherwise({
		template : "<h1>Error 404</h1><p>Page does not exist</p>"
	});
});

app.constant("myConfig", {
	"1" : "Club",
	"2" : "Bar",
	"3" : "Concert",
	"4" : "Market",
	"5" : "Festival",
	"6" : "Charity"
});

app.factory('userId', function() {
	return {
		userId : " "
	};
});

app.service("TravelerService", function($http, $window) {

	var travelerService = {};

	travelerService.getEvents = function(entry) {

		return $http.get("http://104.198.175.48/events/?c=" + entry.country + "&s=" + entry.state + "&y=" + entry.city + "&i=" + entry.id).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '/Date(1495922400000-0300)/',
					Description : '',
					Id : -1,
					Image : '0x',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : " ",
					Alias : " "

				}];
			};
		});

	};

	travelerService.searchEvents = function(entry) {

		return $http.get("http://104.198.175.48/searchEvents/?c=" + entry.country + "&s=" + entry.state + "%y=" + entry.city + "&i=" + entry.id + "&t=" + entry.types + "&f=" + entry.find).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '/Date(1495922400000-0300)/',
					Description : '',
					Id : -1,
					Image : '0x',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : " ",
					Alias : " "

				}];
			};
		});

	};

	travelerService.getUserEvents = function(entry) {

		return $http.get("http://104.198.175.48:8327/userEvents/?a=" + entry.alias + "&i=" + entry.id).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '/Date(1495922400000-0300)/',
					Description : '',
					Id : -1,
					Image : '0x',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : " ",
					Alias : " "

				}];
			};
		});
	};

	travelerService.getMyEvents = function(entry) {

		return $http.get("http://104.198.175.48:8327/myevents/" + entry).then(function(data) {

			return data.data;
		});

	};

	travelerService.getCountries = function() {

		return $http.get("http://104.198.175.48:8327/countries").then(function(data) {

			return data.data;
		});

	};

	travelerService.getStates = function(entry) {

		return $http.get("http://104.198.175.48:8327/states/?n=" + entry).then(function(data) {

			return data.data;
		});

	};

	travelerService.getCities = function(entry) {

		return $http.get("http://104.198.175.48:8327/cities/?n=" + entry).then(function(data) {
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
			url : 'http://104.198.175.48:8327/create',
			data : entry
		});
		console.log(entry);

	};

	travelerService.removeEvent = function(entry) {
		$http({
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json; charset=utf-8'
			},
			url : 'http://104.198.175.48:8327/remove',
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
			url : 'http://104.198.175.48:8327/register',
			data : entry
		});
		console.log(entry);
	};

	travelerService.login = function(entry) {

		return $http.get("http://104.198.175.48:8327/login/?e=" + entry.Email + "&p=" + entry.Password).then(function(data) {

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

app.controller("LoginDataController", ["$scope", "userId", "$routeParams", "$location", "TravelerService", "$window",
function($scope, userId, $routeParams, $location, TravelerService, $window) {

	$scope.register = function() {
		TravelerService.register($scope.signUp);
		$location.path("/");
	};

	$scope.back = function() {
		$window.history.back();
	};

	$scope.sign = function() {
		$location.path("/register");
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

app.controller("MainController", ["$scope", "$routeParams", "$location", "TravelerService", "$geolocation", "userId", "$route", "$window",
function($scope, $routeParams, $location, TravelerService, ngGeolocation, userId, $route, $window) {
	$scope.id = userId.userId;

	$window.navigator.permissions.query({
		'name' : 'geolocation'
	}).then(function(permissions) {
		if (permissions.state == 'prompt') {
			ngGeolocation.getCurrentPosition();
			$route.reload();
		} else if (permissions.state == 'granted') {
			ngGeolocation.getCurrentPosition().then(function(position) {
				TravelerService.location(position.coords).then(function(response) {
					$scope.location = response;
				}).then(TravelerService.getCountries().then(function(response) {
					$scope.countries = response;
				}).then(function(response) {
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
		} else {
			TravelerService.getCountries().then(function(response) {
				$scope.countries = response;
			}).then(function() {
				$scope.country = $scope.countries[0];
				$scope.states = [{
					Name : 'Select'
				}];
				$scope.state = $scope.states[0];
				$scope.cities = [{
					Name : 'Select'
				}];
				$scope.city = $scope.cities[0];
			});
		}
		;
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
		$location.path("/events/" + $scope.country.Name + "/" + $scope.state.Name + "/" + $scope.city.Name + "/" + -1 + "/All" + "/All");
	};

	$scope.logout = function() {
		userId.userId = " ";
		$route.reload();
	};

}]);

app.controller("EventsController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "userId",
function($scope, $routeParams, $location, TravelerService, myConfig, userId) {
	$scope.id = userId.userId;
	var params = $routeParams;
	var id = '-1';

	TravelerService.getEvents(params).then(function(response) {
		$scope.events = response;
	});

	$scope.type = function(typeId) {
		return myConfig[typeId];
	};
	$scope.types = {
		Club : true,
		Bar : true,
		Concert : true,
		Market : true,
		Festival : true,
		Charity : true
	};

	$scope.searchEvents = function() {
		var temp = "";
		angular.forEach($scope.types, function(x1, z1) {//this is nested angular.forEach loop
			if (x1) {
				angular.forEach(myConfig, function(v1, k1) {//this is nested angular.forEach loop
					if (v1 == z1) {
						z1 = k1;
					};
				});
				temp = temp + z1 + ",";
			};
		});
		temp = temp.slice(0, -1);
		params.types = temp;
		if ($scope.find != '') {
			params.find = $scope.find;
		} else {
			params.find = "undefined";
		};

		console.log(params);
		TravelerService.searchEvents(params).then(function(response) {
			$scope.events = response;
		});
	};

	$scope.searchAlias = function(alias) {
		var temp = "";

		angular.forEach(myConfig, function(v1, k1) {//this is nested angular.forEach loop
			temp = temp + k1 + ",";
		});
		temp = temp.slice(0, -1);

		$location.path("/user/" + alias);
	};

	$scope.city = $routeParams.city;

	$scope.logout = function() {
		userId.userId = " ";
	};

	$scope.next = function() {
		id = params.id;
		params.id = $scope.events[($scope.events.length - 1)].Id;
		TravelerService.getEvents(params).then(function(response) {
			$scope.events = response;
		});
	};

	$scope.prev = function() {
		if (id != params.id) {
			params.id = id;
			TravelerService.getEvents(params).then(function(response) {
				$scope.events = response;
			});
		};
	};

}]);

app.controller("UserEventsController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "userId",
function($scope, $routeParams, $location, TravelerService, myConfig, userId) {
	$scope.id = userId.userId;
	var params = {
		alias : $routeParams.alias,
		id : '-1'
	};

	var id = '-1';

	TravelerService.getUserEvents(params).then(function(response) {
		$scope.events = response;
		$scope.alias = response[0].Alias;
		console.log($scope.events);
	});

	$scope.type = function(typeId) {
		return myConfig[typeId];
	};

	$scope.logout = function() {
		userId.userId = " ";
	};

	$scope.next = function() {
		id = params.id;
		params.id = $scope.events[($scope.events.length - 1)].Id;
		TravelerService.getUserEvents(params).then(function(response) {
			$scope.events = response;
		});
	};

	$scope.prev = function() {
		if (id != params.id) {
			params.id = id;
			TravelerService.getUserEvents(params).then(function(response) {
				$scope.events = response;
			});
		};
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

	$scope.remove = function(id) {
		TravelerService.removeEvent(id);
	};

}]);

app.controller("CreateEventController", ["$scope", "userId", "$routeParams", "$location", "TravelerService", "myConfig", "$geolocation", "$window", "$route", "$filter",
function($scope, userId, $routeParams, $location, TravelerService, myConfig, ngGeolocation, $window, $route, $filter) {
	$scope.types = myConfig;
	$scope.type = myConfig[1];
	$scope.date = $filter('date')(new Date(), 'dd/MM/yyyy');
	$window.navigator.permissions.query({
		'name' : 'geolocation'
	}).then(function(permissions) {
		if (permissions.state == 'prompt') {
			ngGeolocation.getCurrentPosition();
			$route.reload();
		} else if (permissions.state == 'granted') {
			ngGeolocation.getCurrentPosition().then(function(position) {
				TravelerService.location(position.coords).then(function(response) {
					$scope.location = response;
				}).then(TravelerService.getCountries().then(function(response) {
					$scope.countries = response;
				}).then(function(response) {
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
		} else {
			TravelerService.getCountries().then(function(response) {
				$scope.countries = response;
			}).then(function() {
				$scope.country = $scope.countries[0];
				$scope.states = [{
					Name : 'Select'
				}];
				$scope.state = $scope.states[0];
				$scope.cities = [{
					Name : 'Select'
				}];
				$scope.city = $scope.cities[0];
			});
		}
		;
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
				canvas.width = 350;
				canvas.height = 400;
				ctx.drawImage(img, 5, 5, 350, 400);

				var temp = {
					Name : $scope.event.name,
					Description : $scope.event.description,
					Type : 0,
					Price : $scope.event.price,
					Currency : $scope.event.currency,
					Country : $scope.country.Name,
					State : $scope.state.Name,
					City : $scope.city.Name,
					Addr : $scope.event.no + " " + $scope.event.street + ", " + $scope.event.suburb,
					Site : $scope.event.site,
					Date : $scope.date + " " + $scope.event.time,
					Image : canvas.toDataURL("image/png"),
					UserId : userId.userId
				};

				angular.forEach(myConfig, function(v1, k1) {//this is nested angular.forEach loop
					if (v1 == $scope.type) {
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

