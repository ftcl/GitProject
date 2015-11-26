angular.module('starter.services', [])
	.factory('PopupServ', ['$ionicPopup',
		function($ionicPopup) {
			var service = {
				alert: alert,
				confirm: confirm,
				promot: promot
			}
			return service;

			// An alert dialog
			function alert(title, template) {
				var alertPopup = $ionicPopup.alert({
					title: title,
					template: template,
					okText: "确定"
				});
				alertPopup.then(function(res) {
					console.log('Thank you for not eating my delicious ice cream cone');
				});
			};

			function confirm(title, template) {
				var confirmPopup = $ionicPopup.confirm({
					title: title,
					template: template,
					cancelText: "取消",
					okText: "确定",
				});
				confirmPopup.then(function(res) {
					if (res) {
						console.log('You are sure');
					} else {
						console.log('You are not sure');
					}
				});
			}

			function promot() {
				var promptPopup = $ionicPopup.prompt({
					title: 'Password Check',
					template: 'Enter your secret password',
					inputType: 'password',
					inputPlaceholder: 'Your password'
				});
				promptPopup.then(function(res) {
					console.log('Your password is', res);
				});
			}
		}
	])
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
	]).factory('HttpServ', ['$http', '$q', 'PopupServ',
		function($http, $q, PopupServ) {
			var service = {
				get: get,
				post: post
			}
			return service;

			function get() {
				var q = $q.defer();
				$http.get('json/user.json').success(function(data) {
					q.resolve(data);
				}).error(function() {
					PopupServ.alert("错误", "数据请求错误");
				});
				return q.promise;
			};

			function post(param) {
				var q = $q.defer();
				$http({
					method: 'POST',
					url: 'http://sh.plottwists.com/home/Information',
					data: $.param(param),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(response) {
					
					PopupServ.alert("成功", response);
					q.resolve(response);
				});
				return q.promise;
			}
		}
	])