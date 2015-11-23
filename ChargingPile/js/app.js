angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.city'])
	.run(function($ionicPlatform, $state,$rootScope,LoaclStorageServ) {
		$ionicPlatform.ready(function() {
			$rootScope.isNavigation = LoaclStorageServ.getBoolean("isNavigation",true);
			$rootScope.isLogin =  LoaclStorageServ.getBoolean("isLogin",false);
			
			if ($rootScope.isNavigation) {
				LoaclStorageServ.set("isNavigation",false);
				$state.go('navigation');
			} else {
				$state.go('tab.home');
			}
		});
	}).config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
		function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
			//以下$ionicConfigProvider配置Android和iOS界面配置
			$ionicConfigProvider.platform.ios.tabs.style('standard');
			$ionicConfigProvider.platform.ios.tabs.position('bottom');
			$ionicConfigProvider.platform.android.tabs.style('standard');
			$ionicConfigProvider.platform.android.tabs.position('bottom');

			$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
			$ionicConfigProvider.platform.android.navBar.alignTitle('center');

			$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
			$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

			$ionicConfigProvider.platform.ios.views.transition('ios');
			$ionicConfigProvider.platform.android.views.transition('android');

			$stateProvider
				.state('navigation', {
					url: '/navigation',
					cache: true,
					templateUrl: 'templates/navigation/navigation.html'
				})

			.state('login', {
				url: '/login/:PageState',
				cache: true,
				templateUrl: 'templates/login/login.html',
				controller: 'LoginCtrl'
			})

			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'templates/tabs.html'
			})

			.state('tab.home', {
				url: '/home',
				views: {
					'tab-home': {
						templateUrl: 'templates/home/tab-home.html',
						controller: 'HomeCtrl'
					}
				}
			})
			
			.state('pilelist', {
				url: '/pilelist',
				cache: true,
				templateUrl: 'templates/home/pilelist.html',
				controller: 'PilelistCtrl'
			})
			
			.state('pilesearch', {
				url: '/pilesearch',
				cache: true,
				templateUrl: 'templates/home/pilesearch.html',
				controller: 'PilesearchCtrl'
			})
			
			.state('tab.scan', {
				url: '/scan',
				views: {
					'tab-scan': {
						templateUrl: 'templates/scan/tab-scan.html',
						controller: 'ScanCtrl'
					}
				}
			})

			.state('tab.twinkle', {
				url: '/twinkle',
				views: {
					'tab-twinkle': {
						templateUrl: 'templates/twinkle/tab-twinkle.html',
						controller: 'TwinkleCtrl'
					}
				}
			})

			.state('tab.my', {
				url: '/my',
				views: {
					'tab-my': {
						templateUrl: 'templates/my/tab-my.html',
						controller: 'MyCtrl'
					}
				}
			});

			// if none of the above states are matched, use this as the fallback
			$urlRouterProvider.otherwise('tab/home');

		}
	]);