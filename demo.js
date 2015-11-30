var Module = angular.module('ionicApp', ['ionic'])
Module
	.controller('AppCtrl', ['$scope',
		function($scope, dateFilter, $ionicPopover) {
			window.onerror = function(err) {
				log('window.onerror: ' + err);
			};
			var rootBridge =null;
			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			}; //end function connectWebViewJavascriptBridge
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init();
				//注册handler
				rootBridge
//				$scope.register_call_btn = function() {
					bridge.registerHandler('registertocallHandler', function(data, responseCallback) {
						$scope.$apply(function() {
							var jsonData = angular.fromJson(data);
							$scope.register_call = jsonData.location.address +" " +  jsonData.name;
						});
						responseData = {
							register_call: 'js registerHandler -> callHandler callback success'
						}
						responseCallback(responseData);
					});
//				}; //end register_call_btn
			}); //end connectWebViewJavascriptBridge


			$scope.call_register_btn = function() {
				window.WebViewJavascriptBridge.callHandler('calltoregisterHandler', " js callHandler -> registerHandler callback success", function(response) {
					$scope.$apply(function() {
						$scope.call_register = response;
					});
				})
			}; //end call_register_btn
		}
	])