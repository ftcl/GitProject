angular.module('starter.controllers', [])

.controller('LoginCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$stateParams','LoaclStorageServ','$ionicHistory',
	function($scope, $rootScope, $timeout, $state, $stateParams,LoaclStorageServ,$ionicHistory) {
		$scope.codeBtn = {
			text: "获取验证码",
			time: ""
		};
		$scope.login = {
			account: "",
			password: "",
			register: true
		}
		$scope.GetCode = function() {
			if (typeof($scope.codeBtn.time) == "string") {
				$scope.codeBtn.text = "获取中";
				$scope.codeBtn.time = 10;
				calctime();
			}
		};
		$scope.doLogin = function() {
			$rootScope.isLogin = true;
			LoaclStorageServ.set("isLogin",true);
			$state.go("tab." + $stateParams.PageState);
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

.controller('HomeCtrl', ['$scope', 'WeatherServ','$ionicModal','HttpServ',
	function($scope, WeatherServ,$ionicModal,HttpServ) {
		$scope.home = {
			city: "重庆",
			day: WeatherServ.day(),
			week: WeatherServ.week(),
			weather: WeatherServ.weather("重庆")
		};
		$scope.selectCity = function() {
			if (!$scope.modal) {
				$ionicModal.fromTemplateUrl('templates/home/selectcity.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.modal = modal;
					$scope.modal.show();
				});
			} else {
				$scope.modal.show();
			}
		};
		
		$scope.httpPost=function(){
			var data={
				data:"test data"
			}
			HttpServ.post(data).then(function(data){
				$scope.httpback = data;
			})
		}
	}
])
.controller('PilelistCtrl', ['$scope','$ionicModal',
	function($scope,$ionicModal) {
		$scope.pilelist ={
			type:0,
			location:"未知"
		}
		$scope.barclick=function(index){
			$scope.pilelist.type = index;
		}
	}
])
.controller('PilesearchCtrl', ['$scope','$ionicHistory','$ionicModal',
	function($scope, $ionicHistory,$ionicModal) {
		$scope.goBack= function(){
			$ionicHistory.goBack();
		}
		$scope.searchclick=function(index){
			$scope.pilelist.type = index;
		}
	}
])
.controller('ScanCtrl', ['$scope', '$rootScope', '$state',
	function($scope, $rootScope, $state) {
		$scope.$on("$ionicView.beforeEnter", function() {
			if (!$rootScope.isLogin) {
				$state.go("login", {
					PageState: "scan"
				});
			}
		})
	}
])

.controller('TwinkleCtrl', ['$scope', '$rootScope', '$state',
	function($scope, $rootScope, $state) {
		$scope.$on("$ionicView.beforeEnter", function() {
			if (!$rootScope.isLogin) {
				$state.go("login", {
					PageState: "twinkle"
				});
			}
		})
	}
])

.controller('MyCtrl', ['$scope', '$rootScope', '$state',
	function($scope, $rootScope, $state) {
		$scope.$on("$ionicView.beforeEnter", function() {
			if (!$rootScope.isLogin) {
				$state.go("login", {
					PageState: "my"
				});
			}
		})
		
		$scope.user={
			head:"img/head.png",
			level:"充电新手",
			account:"187****7796",
			balance:5.00
		}
	}
])