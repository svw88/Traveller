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
	}).when("/events/:id", {
		templateUrl : "views/eventpage.html",
		controller : "EventPageController"
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

var userId = [{
	id : -1,
	alias : ''
}];

app.service("TravelerService", function($http, $window) {

	var travelerService = {};

	var serverAddr = "http://traveller-168120.appspot.com/Tasks";

	travelerService.getEvents = function(entry) {

		return $http.get(serverAddr + "/events/" + entry.date + "/" + entry.country + "/" + entry.state + "/" + entry.city + "/" + entry.id).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '2017-05-19T15:00:00.000Z',
					Description : '',
					Id : -1,
					Image : '',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : -1,
					Alias : ""

				}];
			};
		});

	};

	travelerService.getEvent = function(entry) {

		return $http.get(serverAddr + "/events/" + entry.id).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '2017-05-19T15:00:00.000Z',
					Description : '',
					Id : -1,
					Image : '',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : -1,
					Alias : ""

				}];
			};
		});

	};

	travelerService.searchEvents = function(entry) {

		return $http.get(serverAddr + "/events/" + entry.date + "/" + entry.country + "/" + entry.state + "/" + entry.city + "/" + entry.id + "/search/" + entry.find).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '2017-05-19T15:00:00.000Z',
					Description : '',
					Id : -1,
					Image : '',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : -1,
					Alias : " "

				}];
			};
		});

	};

	travelerService.getFilterEvents = function(entry) {

		return $http.get(serverAddr + "/events/" + entry.date + "/" + entry.country + "/" + entry.state + "/" + entry.city + "/" + entry.id + "/" + entry.type).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '2017-05-19T15:00:00.000Z',
					Description : '',
					Id : -1,
					Image : '',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : -1,
					Alias : " "

				}];
			};
		});

	};

	travelerService.getSearchFilterEvents = function(entry) {

		return $http.get(serverAddr + "/events/" + entry.date + "/" + entry.country + "/" + entry.state + "/" + entry.city + "/" + entry.id + "/search/" + entry.type + "/" + entry.find).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '2017-05-19T15:00:00.000Z',
					Description : '',
					Id : -1,
					Image : '',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : -1,
					Alias : " "

				}];
			};
		});

	};

	travelerService.getUserEvents = function(entry) {

		return $http.get(serverAddr + "/events/" + entry.date + "/" + entry.alias + "/" + entry.id).then(function(data) {
			if (data.data.length > 0) {
				return data.data;
			} else {
				return [{
					City : '',
					Country : '',
					Currency : '',
					Date : '2017-05-19T15:00:00.000Z',
					Description : '',
					Id : -1,
					Image : '',
					Name : 'No More Events',
					Price : 0,
					Site : '',
					State : '',
					Type : 1,
					UserId : -1,
					Alias : " "

				}];
			};
		});
	};

	travelerService.getMyEvents = function(entry) {

		return $http.get(serverAddr + "/events/" + entry.userId + "/" + entry.date).then(function(data) {

			return data.data;
		});

	};

	travelerService.getCountries = function() {

		return $http.get(serverAddr + "/countries").then(function(data) {

			return data.data;
		});

	};

	travelerService.getStates = function(entry) {

		return $http.get(serverAddr + "/states/" + entry).then(function(data) {

			return data.data;
		});

	};

	travelerService.getCities = function(entry) {

		return $http.get(serverAddr + "/cities/" + entry).then(function(data) {
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
		console.log(entry);
		$http({
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json; charset=utf-8'
			},
			url : serverAddr + '/create',
			data : entry
		});

	};

	travelerService.imageUpload = function(entry) {
		console.log(entry);
		return $http({
			method : 'POST',
			headers : {
				'Content-Type' : 'image/*',
			},
			url : 'https://www.googleapis.com/upload/storage/v1/b/travellerweb-168202.appspot.com/o?uploadType=media&name=image-' + entry.name + entry.date.replace('/', '-').replace('/', '-') + entry.id + ".jpeg",
			data : entry.img

		}).then(function(data) {
			return data;
		});

	};

	travelerService.removeEvent = function(entry) {
		return $http.delete(serverAddr + '/remove/' + entry).then(function(data) {
			return data;
		});

	};

	travelerService.register = function(entry) {
		$http({
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json; charset=utf-8'
			},
			url : serverAddr + '/register',
			data : entry
		});
		console.log(entry);
	};

	travelerService.login = function(entry) {

		return $http.get(serverAddr + "/login/" + entry.Email + "/" + entry.Password).then(function(data) {

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

app.controller("LoginDataController", ["$scope", "$routeParams", "$location", "TravelerService", "$window",
function($scope, $routeParams, $location, TravelerService, $window) {

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
		TravelerService.login($scope.signUp).then(function(response) {

			if (response.length > 0) {
				userId = response;
				$location.path("/login");
			};
		});

	};
}]);

app.controller("MainController", ["$scope", "$routeParams", "$location", "TravelerService", "$geolocation", "$route", "$window",
function($scope, $routeParams, $location, TravelerService, ngGeolocation, $route, $window) {
	$scope.id = userId[0].id;
	$scope.alias = userId[0].alias;

	//$window.navigator.permissions.query({
	//'name' : 'geolocation'
	//}).then(function(permissions) {
	//if (permissions.state == 'prompt') {
	//ngGeolocation.getCurrentPosition();
	//$route.reload();
	//} else if (permissions.state == 'granted') {
	//ngGeolocation.getCurrentPosition().then(function(position) {
	//TravelerService.location(position.coords).then(function(response) {
	//$scope.location = response;
	//}).then(TravelerService.getCountries().then(function(response) {
	//	$scope.countries = response;
	//}).then(function(response) {
	//$scope.countries.splice(0, 0, {
	//Name : $scope.location[6].long_name
	//});
	//$scope.country = $scope.countries[0];
	//$scope.states = [{
	//Name : $scope.location[5].long_name
	//}];
	//$scope.state = $scope.states[0];
	//$scope.cities = [{
	//	Name : $scope.location[4].long_name
	//	}];
	//	$scope.city = $scope.cities[0];
	//	}));
	//	});
	//} else {
	$scope.countries = [{
		id : 0,
		name : ''
	}];
	TravelerService.getCountries().then(function(response) {
		$scope.countries = response;
		$scope.country = $scope.countries[0];
	}).then(function() {
		TravelerService.getStates($scope.country.id).then(function(response) {
			$scope.states = response;
			$scope.state = $scope.states[0];
		}).then(function(response) {
			TravelerService.getCities($scope.state.id).then(function(response) {
				$scope.cities = response;
				$scope.city = $scope.cities[0];
			});
		});
	});
	//};
	//});

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
		$location.path("/events/" + $scope.country.name + "/" + $scope.state.name + "/" + $scope.city.name + "/" + -1 + "/All" + "/All");
	};

	$scope.logout = function() {
		userId[0].id = -1;
		$route.reload();
	};

}]);

app.controller("EventsController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "$filter",
function($scope, $routeParams, $location, TravelerService, myConfig, $filter) {
	$scope.id = userId[0].id;
	$scope.alias = userId[0].alias;
	var params = $routeParams;
	params.find = '';
	var id = '-1';
	params.date = $filter('date')(new Date(), 'yyyy-MM-dd');

	TravelerService.getEvents(params).then(function(response) {
		$scope.events = response;
		console.log($scope.events);
	});

	$scope.type = function(typeId) {
		return myConfig[typeId];
	};

	$scope.types = {
		"0" : "All",
		"1" : "Club",
		"2" : "Bar",
		"3" : "Concert",
		"4" : "Market",
		"5" : "Festival",
		"6" : "Charity"
	};
	$scope.typeSelect = $scope.types[0];

	$scope.searchEvents = function() {

		params.find = $scope.find;

		if ($scope.typeSelect == 'All' && (params.find == undefined || params.find == '')) {
			TravelerService.getEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else if ($scope.typeSelect == 'All') {
			TravelerService.searchEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else if (params.find == undefined || params.find == '') {
			TravelerService.getFilterEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else {
			TravelerService.getSearchFilterEvents(params).then(function(response) {
				$scope.events = response;
			});
		}
		;
	};

	$scope.filterEvents = function() {
		if ($scope.typeSelect == 'All' && (params.find == undefined || params.find == '')) {
			TravelerService.getEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else if ($scope.typeSelect == 'All') {
			TravelerService.searchEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else if (params.find == undefined || params.find == '') {
			angular.forEach(myConfig, function(v1, k1) {//this is nested angular.forEach loop
				if (v1 == $scope.typeSelect) {
					params.type = parseInt(k1);
				};
			});
			TravelerService.getFilterEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else {
			angular.forEach(myConfig, function(v1, k1) {//this is nested angular.forEach loop
				if (v1 == $scope.typeSelect) {
					params.type = parseInt(k1);
				};
			});
			TravelerService.getSearchFilterEvents(params).then(function(response) {
				$scope.events = response;
			});
		}
		;

	};

	$scope.searchAlias = function(alias) {

		$location.path("/user/" + alias);
	};
	$scope.city = $routeParams.city;

	$scope.logout = function() {
		userId[0].id = -1;
	};

	$scope.next = function() {
		id = params.id;
		params.id = $scope.events[($scope.events.length - 1)].Id;
		if ($scope.typeSelect == 'All' && (params.find == undefined || params.find == '')) {
			TravelerService.getEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else if ($scope.typeSelect == 'All') {
			TravelerService.searchEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else if (params.find == undefined || params.find == '') {
			TravelerService.getFilterEvents(params).then(function(response) {
				$scope.events = response;
			});
		} else {
			TravelerService.getSearchFilterEvents(params).then(function(response) {
				$scope.events = response;
			});
		}
		;
	};

	$scope.prev = function() {
		if (id != params.id) {
			params.id = id;
			if ($scope.typeSelect == 'All' && (params.find == undefined || params.find == '')) {
				TravelerService.getEvents(params).then(function(response) {
					$scope.events = response;
				});
			} else if ($scope.typeSelect == 'All') {
				TravelerService.searchEvents(params).then(function(response) {
					$scope.events = response;
				});
			} else if (params.find == undefined || params.find == '') {
				TravelerService.getFilterEvents(params).then(function(response) {
					$scope.events = response;
				});
			} else {
				TravelerService.getSearchFilterEvents(params).then(function(response) {
					$scope.events = response;
				});
			}
			;

		};
	};

}]);

app.controller("EventPageController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "$filter", "$sce",
function($scope, $routeParams, $location, TravelerService, myConfig, $filter, $sce) {
	$scope.id = userId[0].id;
	$scope.alias = userId[0].alias;
	var params = $routeParams;

	TravelerService.getEvent(params).then(function(response) {
		$scope.events = response;
		console.log($scope.events);
		$scope.gmap = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?key=AIzaSyCGbvYrgjTZu1wbTfp_zIfY810vrX6q3nQ&q=" + $scope.events[0].Addr + "," + $scope.events[0].City + "," + $scope.events[0].State + "," + $scope.events[0].Country);
	});

	$scope.type = function(typeId) {
		return myConfig[typeId];
	};

	$scope.searchAlias = function(alias) {

		$location.path("/user/" + alias);
	};
	$scope.city = $routeParams.city;

	$scope.logout = function() {
		userId[0].id = -1;
	};

}]);

app.controller("UserEventsController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "$filter",
function($scope, $routeParams, $location, TravelerService, myConfig, $filter) {
	$scope.id = userId[0].id;
	$scope.alias = userId[0].alias;
	var params = {
		alias : $routeParams.alias,
		id : '-1'
	};
	params.date = $filter('date')(new Date(), 'yyyy-MM-dd');

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
		userId[0].id = -1;
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

app.controller("MyEventsController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "$route", "$filter",
function($scope, $routeParams, $location, TravelerService, myConfig, $route, $filter) {
	$scope.id = userId[0].id;
	$scope.alias = userId[0].alias;
	var params = {
		userId : userId[0].id,
		date : $filter('date')(new Date(), 'yyyy-MM-dd')

	};

	if (userId[0].id != -1) {
		TravelerService.getMyEvents(params).then(function(response) {
			console.log(response);
			$scope.events = response;

		});

		$scope.type = function(typeId) {
			return myConfig[typeId];
		};
	} else {
		$location.path("/");
	};

	$scope.logout = function() {
		userId[0].id = -1;
	};

	$scope.refresh = function() {
		$route.reload();
	};

	$scope.remove = function(Id) {
		console.log(Id);
		TravelerService.removeEvent(Id).then(function(response) {
			$route.reload();
		});
	};

}]);

app.controller("CreateEventController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "$geolocation", "$window", "$route", "$filter",
function($scope, $routeParams, $location, TravelerService, myConfig, ngGeolocation, $window, $route, $filter) {
	$scope.id = userId[0].id;
	$scope.alias = userId[0].alias;
	$scope.types = myConfig;
	$scope.type = myConfig[1];
	$scope.date = $filter('date')(new Date(), 'yyyy/MM/dd');
	$scope.countries = [{
		id : 0,
		name : ''
	}];
	if (userId[0].id != -1) {
		TravelerService.getCountries().then(function(response) {
			$scope.countries = response;
			$scope.country = $scope.countries[0];
		}).then(function() {
			TravelerService.getStates($scope.country.id).then(function(response) {
				$scope.states = response;
				$scope.state = $scope.states[0];
			}).then(function(response) {
				TravelerService.getCities($scope.state.id).then(function(response) {
					$scope.cities = response;
					$scope.city = $scope.cities[0];
				});
			});
		});
	} else {
		$location.path("/");
	};

	$scope.logout = function() {
		userId[0].id = -1;
		$route.reload();
	};

	function dataURItoBlob(dataURI) {

		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {
			type : mimeString
		});
	}


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
	$scope.createEvent = function() {

		if (userId[0].id != -1) {
			var canvas = document.createElement("canvas");
			var img = new Image();
			img.src = $scope.event.img;
			img.onload = function() {

				var ctx = canvas.getContext("2d");
				canvas.width = 207;
				canvas.height = 274;
				ctx.drawImage(img, 0, 0, 207, 274);
				var dataurl = canvas.toDataURL("image/jpeg", 0.7);
				var blob = dataURItoBlob(dataurl);
				$scope.event.img = new File([blob], 'fileName.jpeg', {
					type : "'image/jpeg"
				});
				$scope.event.date = $scope.date;
				$scope.event.id = userId[0].id;
				TravelerService.imageUpload($scope.event).then(function(response) {
					$location.path("/login");
				});
			};

			var temp = {
				Name : $scope.event.name,
				Description : $scope.event.description,
				Type : 0,
				Price : parseInt($scope.event.price),
				Currency : $scope.event.currency,
				Country : $scope.country.name,
				State : $scope.state.name,
				City : $scope.city.name,
				Addr : $scope.event.street + ", " + $scope.event.suburb,
				Site : $scope.event.site,
				Date : $scope.date + " " + $scope.event.time,
				Image : "https://www.googleapis.com/download/storage/v1/b/travellerweb-168202.appspot.com/o/image-" + $scope.event.name + $scope.date.replace('/', '-').replace('/', '-') + userId[0].id + ".jpeg?alt=media",
				UserId : userId[0].id,
				Alias : userId[0].alias
			};

			angular.forEach(myConfig, function(v1, k1) {//this is nested angular.forEach loop
				if (v1 == $scope.type) {
					temp["Type"] = parseInt(k1);
				};
			});

			TravelerService.create(temp);
		};
	};
}]);

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

app.filter('dateToISO', function() {
	return function(input) {
		if (input != undefined) {
			return new Date(input).toISOString();
		};
	};
});

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

