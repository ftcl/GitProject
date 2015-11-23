angular.module('starter.controllers', [])

.controller('LoginCtrl', ['$scope', '$rootScope', '$timeout',
	function($scope, $rootScope, $timeout) {
		$scope.codeBtn = {
			text: "获取验证码",
			time: ""
		};
		$scope.login = {
			account: "",
			password: "",
			register: false
		}
		$scope.GetCode = function() {
			if (typeof($scope.codeBtn.time) == "string") {
				$scope.codeBtn.text = "获取中";
				$scope.codeBtn.time = 10;
				calctime();
			}
		};
		$scope.doLogin = function() {
			$scope.go()
		};

		function calctime() {
			$timeout(function() {
				$scope.codeBtn.time -= 1;
				if ($scope.codeBtn.time == 0) {
					$scope.codeBtn.text = "获取验证码";
					$scope.codeBtn.time = "";
				} else {
					calctime();
				}
			}, 1000);
		}
	}
])

.controller('HomeCtrl', ['$scope', function($scope) {

}])

.controller('ScanCtrl', ['$scope', '$rootScope', '$state',
	function($scope, $rootScope, $state) {
		$scope.$on("$ionicView.enter", function() {
			if (!$rootScope.isLogin) {
				$state.go("login");
			}
		})
	}
])

.controller('TwinkleCtrl', ['$scope', '$rootScope', '$state',
	function($scope, $rootScope, $state) {
		$scope.$on("$ionicView.enter", function() {
			if (!$rootScope.isLogin) {
				$state.go("login");
			}
		})
	}
])

.controller('MyCtrl', ['$scope', '$rootScope', '$state',
	function($scope, $rootScope, $state) {
		$scope.$on("$ionicView.enter", function() {
			if (!$rootScope.isLogin) {
				$state.go("login");
			}
		})
	}
])