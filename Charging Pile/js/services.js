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
			getObject: function(key,defaultValue) {
				return angular.fromJson($window.localStorage[key] || defaultValue);
			},
			getBoolean: function(key,defaultValue) {
				if($window.localStorage[key]=="true")
				{
					return true;
				}else if($window.localStorage[key]=="false"){
					return false;
				}else{
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
]);