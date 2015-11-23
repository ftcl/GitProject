angular.module('starter.services', [])
.factory('Chats', function() {

	})
	.factory('LoaclStorageServ', ['$window',
		function($window) {
			return {
				set: function(key, value) {
					$window.localStorage[key] = value; 
				},
				get: function(key, defaultValue) {
					return $window.localStorage[key] || defaultValue;
				},
				setObject: function(key, value) {
					$window.localStorage[key] = angular.toJson(value);
				},
				getObject: function(key, defaultValue) {
					return angular.fromJson($window.localStorage[key] || defaultValue);
				},
				getBoolean: function(key, defaultValue) {
					if ($window.localStorage[key] == "true") {
						return true;
					} else if ($window.localStorage[key] == "false") {
						return false;
					} else {
						return defaultValue;
					}
				},
				removeItem: function(key) {
					return $window.localStorage.removeItem(key);
				},
				clear: function() {
					return $window.localStorage.clear();
				}
			}
		}
	])
	.factory('WeatherServ', ['dateFilter',
		function(dateFilter) {
			var service = {
				week: week,
				day: day,
				weather: weather
			}
			return service;

			function week() {
				var d = new Date();
				var week = "";
				switch (d.getDay()) {
					case 1:
						week = "星期一";
						break;
					case 2:
						week = "星期二";
						break;
					case 3:
						week = "星期三";
						break;
					case 4:
						week = "星期四";
						break;
					case 5:
						week = "星期五";
						break;
					case 6:
						week = "星期六";
						break;
					default:
						week = "星期日";
				};
				return week;
			};

			function day() {
				return dateFilter(new Date(), "yyyy/MM/dd")
			};

			function weather(city) {
				return "晴";
			}
		}
	])