var app = angular.module('travelerWeb', ["ngRoute", "ngGeolocation", "ngGapi"]);

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

	travelerService.searchEvents = function(entry) {
		if (entry.find == undefined || entry.find == "") {
			entry.find = "?";
		};
		return $http.get(serverAddr + "/events/" + entry.date + "/" + entry.country + "/" + entry.state + "/" + entry.city + "/" + entry.id + "/" + entry.types + "/" + entry.find).then(function(data) {
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
		$http({
			method : 'POST',
			headers : {
				'Content-Type' : 'image/*',
			},
			url : 'https://www.googleapis.com/upload/storage/v1/b/travellerstorage/o?uploadType=media&name=images/' + entry.date + entry.id + ".jpeg",
			data : entry.img
		});

	};

	travelerService.removeEvent = function(entry) {
		$http.delete(serverAddr + '/remove/' + entry).then(function(data) {
			return data.data;
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

app.controller("MainController", ["$scope", "$routeParams", "$location", "TravelerService", "$geolocation", "$route", "$window", "$gapi",
function($scope, $routeParams, $location, TravelerService, ngGeolocation, $route, $window, $gapi) {
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
		$gapi.client.init({
			'clientId' : '632210925469-anpvg0k3nteopm99nlfcn39pmsb9sv45.apps.googleusercontent.com',
			'scope' : 'profile'
		}).then(function() {
			// 3. Initialize and make the API request.
			return $gapi.client.request({
				'path' : 'https://storage.cloud.google.com/travellerstorage/images',
			});
		}).then(function(response) {
			console.log(response);
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
	var id = '-1';
	params.date = $filter('date')(new Date(), 'dd-MM-yyyy');

	TravelerService.getEvents(params).then(function(response) {
		$scope.events = response;
		console.log($scope.events);

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

		params.find = $scope.find;

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
		userId[0].id = -1;
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

app.controller("UserEventsController", ["$scope", "$routeParams", "$location", "TravelerService", "myConfig", "$filter",
function($scope, $routeParams, $location, TravelerService, myConfig, $filter) {
	$scope.id = userId[0].id;
	$scope.alias = userId[0].alias;
	var params = {
		alias : $routeParams.alias,
		id : '-1'
	};
	params.date = $filter('date')(new Date(), 'dd-MM-yyyy');

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
		date : $filter('date')(new Date(), 'dd-MM-yyyy')

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
		TravelerService.removeEvent(Id);
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
				canvas.height = 242;
				ctx.drawImage(img, 5, 5, 207, 242);
				var dataurl = canvas.toDataURL("image/png", 0.7);
				var blob = dataURItoBlob(dataurl);
				$scope.event.img = new File([blob], 'fileName.jpeg', {
					type : "'image/jpeg"
				});
				$scope.event.date = $scope.date;
				$scope.event.id = userId[0].id;
				TravelerService.imageUpload($scope.event);
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
				Addr : $scope.event.no + " " + $scope.event.street + ", " + $scope.event.suburb,
				Site : "http://" + $scope.event.site,
				Date : $scope.date + " " + $scope.event.time,
				Image : "https://storage.cloud.google.com/travellerstorage/images/" + $scope.date + userId[0].id + ".jpeg",
				UserId : userId[0].id,
				Alias : userId[0].alias
			};

			angular.forEach(myConfig, function(v1, k1) {//this is nested angular.forEach loop
				if (v1 == $scope.type) {
					temp["Type"] = parseInt(k1);
				};
			});
			console.log(temp);

			TravelerService.create(temp);

			$location.path("/login");
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
		return new Date(input).toISOString();
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

