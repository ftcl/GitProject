var Module = angular.module('ionicApp', ['ionic'])
Module
	.controller('AppCtrl', ['$scope', 'dateFilter', '$ionicPopover',
		function($scope, dateFilter, $ionicPopover) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};

			$scope.pay = {
				type: "alipay"
			}
			$scope.isCoupons = false;
			$scope.couponshow = "无可用优惠券";
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.severName = data["severName"]; //"全是理疗";
						$scope.price = data["price"]; //"158";
						$scope.severId = data["severId"]; //服务id
						$scope.appointAddress = data["address"] + data["doorplate"]; //"上海南京路";
						$scope.appointTime = data["severTime"]; //服务时间
						$scope.invoice = data["whetherPiao"]; //优惠券
						$scope.couch = data["whetherChuang"]; //70元
						$scope.phone = data["tel"]; //"1325642897";
						window.WebViewJavascriptBridge.callHandler('AmountHandler', {}, function(response) {
							$scope.$apply(function() {
								$scope.usermoney = parseInt(response);
							})
						});
						window.WebViewJavascriptBridge.callHandler('getCouponsHandler', {}, function(responsedata) {
							$scope.$apply(function() {
								var couponsArr = [];
								var _length = responsedata.length;
								for (var i = 0; i < _length; i++) {
									responsedata[i].expirationTime = responsedata[i].expirationTime.replace("T", " ");
									if (responsedata[i].conditionamount <= $scope.price) {
										couponsArr.push(responsedata[i]);
									}
								}
								$scope.coupons = couponsArr;
								if ($scope.coupons && $scope.coupons.length > 0) {
									$scope.isCoupons = true;
									$scope.couponshow = "";
								}
							});
						})
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData);
				});

				$scope.Submit = function() {
					var oldprice = $scope.price;
					if ($scope.coupon && oldprice >= $scope.coupon.conditionamount) {
						oldprice = oldprice - $scope.coupon.Amount;
					}
					if ($scope.usermoney < oldprice && $scope.pay.type == "amount") {
						window.WebViewJavascriptBridge.callHandler('TipCallback', "余额不足,请选择其他支付方式", function(response) {})
						return false;
					}
					var orderId = dateFilter(new Date(), "yyyyMMddhhmmss") + $scope.severId;

					window.WebViewJavascriptBridge.callHandler('payBtnHandler', {
						'appointTime': $scope.appointTime, //服务时间
						'invoice': $scope.invoice, //优惠券
						'severId': $scope.severId, //服务id
						'appointAddress': $scope.appointAddress, //"上海南京路";
						'price': oldprice, //"158";
						'tel': $scope.phone, //"1325642897";
						'severName': $scope.severName, //"全是理疗";
						'paytype': $scope.pay.type, //支付方式   alipay  wxpay amount
						'couch': $scope.couch,
						'orderId': orderId, //订单id
						'couponsId': $scope.coupon ? $scope.coupon.couponId : "无",
						'userId': $scope.coupon ? $scope.coupon.userId : "无"
					}, function(response) {

					})
				}
			})
			$scope.selectCoupons = function($event) {
				if ($scope.coupons && $scope.coupons.length > 0) {
					var template = '<ion-popover-view><ion-content><div class="list marginnone borderdotted padding"><a class="item" ng-repeat="coupon in coupons" ng-click="selectOneCoupons(coupon)"><p><span class="dataleftspan">￥</span><span class="dataleftmoney">{{coupon.Amount}}</span></p><p class="datacenter"><span class="type brspan">{{coupon.title}}</span><span class="introduction brspan">满{{coupon.conditionamount}}可用</span><span class="overtime brspan">{{coupon.expirationTime}}后过期</span></p></a></div></ion-content></ion-popover-view>';

					$scope.popover = $ionicPopover.fromTemplate(template, {
						scope: $scope
					});
					$scope.popover.show($event);
				}
			};
			$scope.selectOneCoupons = function(coupon) {
				$scope.coupon = coupon;
				$scope.couponshow = "￥" + coupon.Amount;
				$scope.popover.hide();
			}
		}
	])
	.controller('OrderDetailCtrl', ['$scope', '$http',
		function($scope, $http) {
			$scope.commentimages = [0, 1, 2, 3, 4];
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('orderDetailHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.commodity = data["severName"]; //订单类型
						$scope.number = data["copies"]; //数量
						$scope.permoney = data["Prices"]; //单价
						$scope.money = data["totalPrices"]; //总金额
						$scope.phone = data["tel"]; //电话
						$scope.address = data["address"]; //地址
						$scope.message = data["leaveWord"]; //留言
						$scope.orderId = data["orderId"]; //订单号
						$scope.placetime = data["orderTime"].replace("T", " "); //下单时间
						$scope.servicetime = data["severTime"].replace("T", " "); //服务时间
						$scope.paytime = data["time"].replace("T", " "); //付款时间
						if (data["commentMess"] == "no") {
							$scope.isWrite = true;
							$scope.commentlevel = 0;
						} else {
							$scope.isWrite = false;
							$scope.commentcontent = data["commentMess"].content; //评价内容
							$scope.commentlevel = data["commentMess"].rank; //评价星级
							$scope.commenttime = data["commentMess"].time.replace("T", " "); //评价时间
						}
						$scope.status = data["status"]; //状态
						$scope.listStatus = data["listStatus"] == "已完成" ? true : false;
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData);

				});
				$scope.Comment = function() {
					window.WebViewJavascriptBridge.callHandler('getTokenHandler', {}, function(callback) {
						var param = {
							token: callback,
							orderId: $scope.orderId,
							content: $scope.newcomment.commentcontent,
							rank: $scope.commentlevel+1
						}
						$http({
							method: 'POST',
							url: 'http://sh.plottwists.com/home/OrderComment',
							data: $.param(param),
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).success(function(response) {
							if (response.flag == 1) {
								$scope.isWrite = false;
								$scope.commentcontent = $scope.newcomment.commentcontent; //评价内容
								$scope.commenttime = response.commentTime.replace("T", " "); //评价时间
								window.WebViewJavascriptBridge.callHandler('TipCallback', "评论成功", function(tipresponse) {

								})
							} else {
								window.WebViewJavascriptBridge.callHandler('TipCallback', "评论失败", function(tipresponse) {

								})
							}
						});
					})
				}

			})
			$scope.newcomment = {
				commentcontent: ""
			};
			$scope.CommentStar = function(index) {
				$scope.commentlevel = index;
			};

		}
	]).controller('TechOrderDetailCtrl', ['$scope',
		function($scope) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('techOrderDetailHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.severName = data["severName"]; //订单类型
						$scope.copies = data["copies"]; //数量
						$scope.permoney = data["Prices"]; //单价
						$scope.money = data["copies"] * data["Prices"]; //总金额
						$scope.phone = data["tel"]; //电话
						$scope.address = data["address"]; //地址
						$scope.message = data["leaveWord"]; //留言
						$scope.ordernum = data["orderId"]; //订单号
						$scope.placetime = data["orderTime"].replace("T", " "); //下单时间
						$scope.servicetime = data["severTime"].replace("T", " "); //服务时间
						$scope.paytime = data["time"]; //付款时间
						//							$scope.status = data["serviceStatus"];//状态
						$scope.paystatus = data["status"]; //支付状态
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				})
			})
		}
	]).controller('TechDetailCtrl', ['$scope',
		function($scope) {
			$scope.commentimages = [0, 1, 2, 3, 4];
			$scope.commentlevel = -1;
			$scope.itemid = 0;
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('techDetailHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.userhead = "data:image/png;base64," + data["avatar"];
						$scope.username = data["name"]; //姓名
						$scope.usersex = data["sex"]; //性别
						$scope.userage = data["age"]; //年龄
						$scope.useraddress = data["locality"]; //地域
						$scope.userlevel = data["rank"]; //级别
						$scope.usertech = data["serviveClass"]; //服务类型
						$scope.techdetail = data["severExplain"]; //解释
						$scope.techs = data["serviceOrder"];
						$scope.messageGComment = replaceTime(data["messageGComment"]);
						$scope.messageBComment = replaceTime(data["messageBComment"]);
						$scope.messageZComment = replaceTime(data["messageZComment"]);
						$scope.comments = $scope.messageGComment;
						$scope.rate = $scope.messageGComment.length / ($scope.messageBComment.length + $scope.messageGComment.length + $scope.messageZComment.length) * 100;
						$scope.avatar = data["avatar"];
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				})
				$scope.Comment = function() {
					window.WebViewJavascriptBridge.callHandler('techDetailCommentCallback', {
						'techDetail': 'A00001'
					}, function(response) {

					})
				}
				$scope.Order = function(severName, Id, price, severPic) {
					window.WebViewJavascriptBridge.callHandler('techDetailOrderCallback', {
						'name': $scope.username,
						'severName': severName,
						'severId': Id,
						'price': price,
						'severPic': severPic,
						'avatar': $scope.avatar
					}, function(response) {

					})
				}
			});
			$scope.newcomment = {
				commentcontent: ""
			};

			function replaceTime(data) {
				var _length = data.length;
				for (var i = 0; i < _length; i++) {
					data[i].time = data[i].time.replace("T", " ");
				}
				return data;
			}
			$scope.CommentStar = function(index) {
				$scope.commentlevel = index;
			}

			$scope.changeComment = function(index) {
				$scope.itemid = index;
				if (index == 0) {
					$scope.comments = $scope.messageGComment;
				} else if (index == 1) {
					$scope.comments = $scope.messageZComment;
				} else if (index == 2) {
					$scope.comments = $scope.messageBComment;
				}
			}
		}
	]).controller('TechProjectDetailCtrl', ['$scope',
		function($scope) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			$scope.commentimages = [0, 1, 2, 3, 4];
			$scope.instructionimg = "img/SPA.jpg";
			$scope.itemid = 0;
			$scope.projecttype = "卧";
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('techProjectDetailHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.projectname = data["severName"];
						$scope.permoney = data["price"];
						$scope.username = data["name"];
						$scope.userlevel = data["rank"];
						$scope.userhead = data["pic"];
						$scope.projecttime = data["dration"] + "分钟";
						$scope.severId = data["severId"];
						$scope.technicianId = data["technicianId"];
						$scope.comments = dealComment(data["comment"]);
						$scope.content = data["content"];
						$scope.functions = data["function"];
						$scope.specialExplain = data["specialExplain"];
						$scope.nightExplain = data["nightExplain"];
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				})

				$scope.ProjectOrder = function() {
					window.WebViewJavascriptBridge.callHandler('techProjectOrderCallback', {
						'name': $scope.username,
						'severName': $scope.projectname,
						'severId': $scope.severId,
						'price': $scope.permoney,
						'severPic': $scope.userhead
					}, function(response) {

					})
				}
				$scope.otherSever = function() {
					window.WebViewJavascriptBridge.callHandler('otherSeverHandler', {
						'techmicianId': $scope.technicianId
					}, function(response) {

					})
				}
			});

			function dealComment(data) {
				var _length = data.length;
				for (var i = 0; i < _length; i++) {
					if (data[i].commentRank == "好评") {
						data[i].commentlevel = 5;
					} else if (data[i].commentRank == "中评") {
						data[i].commentlevel = 3;
					} else {
						data[i].commentlevel = 1;
					}
					data[i].time = data[i].time.replace("T", " ");
				}
				return data;
			};
		}
	])
	.controller('SelectTimeCtrl', ['$scope', 'dateFilter',
		function($scope, dateFilter) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('selectTimeHandler', function(data, responseCallback) {
					$scope.$apply(function() {

					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				})
				$scope.SelectTime = function() {
					if ($scope.checkTime) {
						var dd = new Date;
						var day = dateFilter(dd.setDate(dd.getDate() + $scope.itemid), "yyyy-MM-dd");
						window.WebViewJavascriptBridge.callHandler('SelectTimeCallback', {
							'day': day,
							'time': $scope.checkTime
						}, function(response) {

						})
					} else {
						window.WebViewJavascriptBridge.callHandler('TipCallback', "请选择预约时间", function(response) {

						})
					}
				}
			});
			$scope.getCurDate = function() {
				var d = new Date();
				switch (d.getDay()) {
					case 1:
						$scope.week = "周四";
						break;
					case 2:
						$scope.week = "周五";
						break;
					case 3:
						$scope.week = "周六";
						break;
					case 4:
						$scope.week = "周日";
						break;
					case 5:
						$scope.week = "周一";
						break;
					case 6:
						$scope.week = "周二";
						break;
					default:
						$scope.week = "周三";
				}
			};
			$scope.getCurDate();
			$scope.timeall = [
				[{
					time: "10:00",
					check: 0,
				}, {
					time: "10:30",
					check: 0,
				}, {
					time: "11:00",
					check: 0,
				}, {
					time: "11:30",
					check: 0,
				}],
				[{
					time: "12:00",
					check: 0,
				}, {
					time: "12:30",
					check: 0,
				}, {
					time: "13:00",
					check: 0,
				}, {
					time: "13:30",
					check: 0,
				}],
				[{
					time: "14:00",
					check: 0,
				}, {
					time: "14:30",
					check: 0,
				}, {
					time: "15:00",
					check: 0,
				}, {
					time: "15:30",
					check: 0,
				}],
				[{
					time: "16:00",
					check: 0,
				}, {
					time: "16:30",
					check: 0,
				}, {
					time: "17:00",
					check: 0,
				}, {
					time: "17:30",
					check: 0,
				}],
				[{
					time: "18:00",
					check: 0,
				}, {
					time: "18:30",
					check: 0,
				}, {
					time: "19:00",
					check: 0,
				}, {
					time: "19:30",
					check: 0,
				}],
				[{
					time: "20:00",
					check: 0,
				}, {
					time: "20:30",
					check: 0,
				}, {
					time: "21:00",
					check: 0,
				}, {
					time: "21:30",
					check: 0,
				}]
			];

			$scope.itemid = 0;
			$scope.changeItemid = function(index) {
				$scope.itemid = index;
			}
			$scope.$watch("itemid", function() {
				if ($scope.itemid == 0) {
					var nowtime = dateFilter(new Date(), "HH:mm");
					var _length1 = $scope.timeall.length;
					for (var i = 0; i < _length1; i++) {
						var _length2 = $scope.timeall[i].length;
						for (var j = 0; j < _length2; j++) {
							var time1 = $scope.timeall[i][j].time.split(':');
							var time2 = nowtime.split(':');
							if (parseInt(time1[0]) < parseInt(time2[0])) {
								$scope.timeall[i][j].check = -1;
							} else if (parseInt(time1[0]) == parseInt(time2[0]) && parseInt(time1[1]) <= parseInt(time2[1])) {
								$scope.timeall[i][j].check = -1;
							}
						}
					}
				} else {
					var _length1 = $scope.timeall.length;
					for (var i = 0; i < _length1; i++) {
						var _length2 = $scope.timeall[i].length;
						for (var j = 0; j < _length2; j++) {
							if ($scope.timeall[i][j].check == -1) {
								$scope.timeall[i][j].check = 0;
							}
						}
					}
				}
			})
			$scope.selectTime = function(time, check) {
				if (check != -1) {
					var _length1 = $scope.timeall.length;
					for (var i = 0; i < _length1; i++) {
						var _length2 = $scope.timeall[i].length;
						for (var j = 0; j < _length2; j++) {
							if ($scope.timeall[i][j].check != -1) {
								if ($scope.timeall[i][j].time == time) {
									$scope.timeall[i][j].check = 1;
									$scope.checkTime = time;
								} else {
									$scope.timeall[i][j].check = 0;
								}
							}
						}
					}
				}
			}
		}
	]).controller('OrderMessageCtrl', ['$scope', '$ionicPopup',
		function($scope, $ionicPopup) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			$scope.itemid = 0;
			$scope.permoney = 158;
			$scope.appointAddress = "请填写服务地址";
			$scope.appointTime = "请选择上门时间";
			$scope.message = {
				price: 0,
				number: 1,
				pricetime: 60,
				housenum: "",
				phone: "",
				word: "",
				couch: false,
				invoice: false,
				invoicemessage: ""
			};

			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('orderMessageHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.userhead = "data:image/png;base64," + data["avatar"];
						$scope.ordertype = data["severName"];
						$scope.tech = data["name"];
						$scope.permoney = data["price"];
						$scope.severId = data["severId"];
						$scope.appointAddress = "请填写服务地址";
						$scope.appointTime = "请选择上门时间";
						$scope.message.price = data["price"];
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				});
				bridge.registerHandler('selectAddressHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.appointAddress = data["appointAddress"];
						$scope.message.phone = data["phoneNum"];
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				});
				bridge.registerHandler('selectTimeHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.appointTime = data["day"] + " " + data["time"];
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				});

				$scope.SubmitOrder = function() {
					var check = Check();
					if (check == true) {
						var data = {
							'severName': $scope.ordertype,
							'severId': $scope.severId,
							'address': $scope.appointAddress,
							'doorplate': $scope.message.housenum,
							'severTime': $scope.appointTime,
							'price': $scope.message.price,
							'invoice': $scope.message.invoicemessage,
							'whetherChuang': $scope.message.couch ? "是" : "否",
							'whetherPiao': $scope.message.invoice ? "是" : "否",
							'tel': $scope.message.phone,
							'copies': $scope.message.number,
							'message': $scope.message.word
						}
						window.WebViewJavascriptBridge.callHandler('SubmitOrderCallback', data, function(response) {

						})
					} else {
						window.WebViewJavascriptBridge.callHandler('TipCallback', check, function(response) {

						})
					}
				}
				$scope.CheckAddress = function() {
					window.WebViewJavascriptBridge.callHandler('CheckAddressCallback', {
						'CheckAddress': 'A00001'
					}, function(response) {

					})
				}
				$scope.CheckTime = function() {
					window.WebViewJavascriptBridge.callHandler('CheckTimeCallback', {
						'CheckTime': 'A00001'
					}, function(response) {

					})
				}


			});

			function Check() {
				if (!$scope.appointAddress || $scope.appointAddress == "" || $scope.appointAddress == "请填写服务地址") {
					return "请填写服务地址";
				} else if (!$scope.message.housenum || $scope.message.housenum == "") {
					return "请填写门牌号";
				} else if (!$scope.message.phone || $scope.message.phone == "") {
					return "请填写联系电话";
				} else if (!$scope.appointTime || $scope.appointTime == "" || $scope.appointTime == "请选择上门时间") {
					return "请选择上门时间";
				} else {
					return true;
				}
			}
			//			$scope.ordertype = "全是理疗 (卧)";
			//			$scope.tech = "自动推荐";
			//			$scope.permoney = 158;
			//			$scope.appointAddress = "请填写服务地址";
			//			$scope.appointTime = "请选择上门时间";
			$scope.Add = function() {
				$scope.message.number += 1;
				$scope.message.price = $scope.permoney * $scope.message.number;
				$scope.message.pricetime = 60 * $scope.message.number;
			}
			$scope.Minus = function() {
				if ($scope.message.number > 1) {
					$scope.message.number -= 1;
					$scope.message.price = $scope.permoney * $scope.message.number;
					$scope.message.pricetime = 60 * $scope.message.number;
				}
			}

			$scope.piaoClick = function(e) {
				e.preventDefault();
				if ($scope.message.invoice) {
					var myPopup = $ionicPopup.confirm({
						template: '<input type="text" ng-model="message.invoicemessage">',
						title: '请填写您需要的发票台头',
						scope: $scope,
						okText: '确定',
						okType: 'button-brown',
						cancelText: '取消'
					});
					myPopup.then(function(res) {
						if (!res) {
							$scope.message.invoicemessage = "";
						}
						myPopup.close();
					});
				}
			};
		}
	])
	.controller('CouponsCtrl', ['$scope',
		function($scope) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('couponsHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						var _length = data.length;
						for (var i = 0; i < _length; i++) {
							data[i].expirationTime = data[i].expirationTime.replace("T", " ");
						}
						$scope.coupons = data;
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				})
				$scope.GetCoupons = function() {
					window.WebViewJavascriptBridge.callHandler('GetCouponsCallback', {
						'GetCoupons': 'A00001'
					}, function(response) {

					})
				}
				$scope.NowUse = function(couponId) {
					window.WebViewJavascriptBridge.callHandler('NowUseCallback', {
						'couponId': couponId
					}, function(response) {

					})
				}
			});

			$scope.UseCoupons = function() {
				window.WebViewJavascriptBridge.callHandler('couponsCallback', {
					'UseCoupons': '11111'
				}, function(response) {

				})
			}
		}
	])
	.controller('TechMyCommentCtrl', ['$scope',
		function($scope) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			$scope.commentimages = [0, 1, 2, 3, 4];

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('techMyCommentCtrlHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.commodity = data["commodity"];
						$scope.number = data["number"];
						$scope.permoney = data["permoney"];
						$scope.money = data["money"];
						$scope.phone = data["phone"];
						$scope.address = data["address"];
						$scope.message = data["message"];
						$scope.ordernum = data["ordernum"];
						$scope.placetime = data["placetime"];
						$scope.servicetime = data["servicetime"];
						$scope.paytime = data["paytime"];
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				})

				$scope.Scan = function() {
					window.WebViewJavascriptBridge.callHandler('ScanCallback', {
						'Scan': '11111'
					}, function(response) {

					})
				}
				$scope.Call = function(index) {
					var myPopup = $ionicPopup.confirm({
						template: '<input type="text" ng-model="addcomment.content">',
						title: '请填写您的评论',
						scope: $scope,
						okText: '确定',
						okType: 'button-brown',
						cancelText: '取消'
					});
					myPopup.then(function(res) {
						if (!res) {
							$scope.addcomment.content = "";
						} else {
							window.WebViewJavascriptBridge.callHandler('CallCallback', {
								'Call': '2222'
							}, function(response) {

							})
						}
					});
				}
			})
			$scope.comments = [{
				img: "img/user.png",
				type: "局部按摩头部",
				time: "2015-08-20 15:20",
				level: 5,
				comment: "手法很不错，服务态度很好以后还会来",
				mycomment: "谢谢你您对我服务的支持，希望下次再为你服务sdfsdf",
			}, {
				img: "img/user.png",
				type: "局部按摩头部",
				time: "2015-08-20 15:20",
				level: 3,
				comment: "手法很不错，服务态度很好以后还会来",
				mycomment: "谢谢你您对我服务的支持，希望下次再为你服务sdfsdf",
			}, {
				img: "img/user.png",
				type: "局部按摩头部",
				time: "2015-08-20 15:20",
				level: 5,
				comment: "手法很不错，服务态度很好以后还会来",
				mycomment: "谢谢你您对我服务的支持，希望下次再为你服务sdfsdf",
			}, {
				img: "img/user.png",
				type: "局部按摩头部",
				time: "2015-08-20 15:20",
				level: 5,
				comment: "手法很不错，服务态度很好以后还会来",
				mycomment: "谢谢你您对我服务的支持，希望下次再为你服务sdfsdf",
			}];

		}
	])
	.controller('MyCommentCtrl', ['$scope',
		function($scope) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			$scope.commentimages = [0, 1, 2, 3, 4];

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('myCommentCtrlHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.commodity = data["commodity"];
						$scope.number = data["number"];
						$scope.permoney = data["permoney"];
						$scope.money = data["money"];
						$scope.phone = data["phone"];
						$scope.address = data["address"];
						$scope.message = data["message"];
						$scope.ordernum = data["ordernum"];
						$scope.placetime = data["placetime"];
						$scope.servicetime = data["servicetime"];
						$scope.paytime = data["paytime"];
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				})

				$scope.Scan = function() {
					window.WebViewJavascriptBridge.callHandler('ScanCallback', {
						'Scan': '11111'
					}, function(response) {

					})
				}
				$scope.Call = function() {
					window.WebViewJavascriptBridge.callHandler('CallCallback', {
						'Call': '2222'
					}, function(response) {

					})
				}
			})
//			$scope.comments = [{
//				img: "img/user.png",
//				type: "局部按摩头部",
//				time: "2015-08-20 15:20",
//				level: 5,
//				comment: "手法很不错，服务态度很好以后还会来",
//				mycomment: "谢谢你您对我服务的支持，希望下次再为你服务sdfsdf",
//			}, {
//				img: "img/user.png",
//				type: "局部按摩头部",
//				time: "2015-08-20 15:20",
//				level: 3,
//				comment: "手法很不错，服务态度很好以后还会来",
//				mycomment: "谢谢你您对我服务的支持，希望下次再为你服务sdfsdf",
//			}, {
//				img: "img/user.png",
//				type: "局部按摩头部",
//				time: "2015-08-20 15:20",
//				level: 5,
//				comment: "手法很不错，服务态度很好以后还会来",
//				mycomment: "谢谢你您对我服务的支持，希望下次再为你服务sdfsdf",
//			}, {
//				img: "img/user.png",
//				type: "局部按摩头部",
//				time: "2015-08-20 15:20",
//				level: 5,
//				comment: "手法很不错，服务态度很好以后还会来",
//				mycomment: "谢谢你您对我服务的支持，希望下次再为你服务sdfsdf",
//			}];
//		}
	]).controller('ProjectDetailCtrl', ['$scope',
		function($scope) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('projectDetailHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.instructionimg = data["instructionimg"];
						$scope.commodity = data["commodity"];
						$scope.perices = data["perices"];
						$scope.time = data["time"];
						$scope.effect = data["effect"];
						$scope.content = data["content"];
						$scope.suitable = data["suitable"];
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback($scope.responseData)
				})
				$scope.ProjectDetail = function() {
					window.WebViewJavascriptBridge.callHandler('projectOrderCallback', {
						'ProjectOrder': 'A00001'
					}, function(response) {

					})
				}
			})
		}
	]).controller('SelectCityCtrl', ['$scope', '$filter', '$location', '$ionicScrollDelegate',
		function($scope, $filter, $location, $ionicScrollDelegate) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			$scope.cityArr = null;

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('selectCityHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.cityArr = data;
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback(responseData)
				})
				$scope.selectCity = function(city) {
					window.WebViewJavascriptBridge.callHandler('SelectCityCallback', {
						'city': city
					}, function(response) {

					})
				}
			});
			$scope.$watch("cityArr", function() {
				if ($scope.cityArr) {
					$scope.contacts = $filter('chineseFilter').filter($filter, $scope.cityArr, "city");
				}
			})
			$scope.alphabet = $filter('chineseFilter').alpha();
			$scope.alphaScroll = alphaScroll;

			function alphaScroll(id) {
				$filter('chineseFilter').alphaScroll(id, "selectCityHandle", $scope.contacts);
			};
		}
	])
	.controller('HelpCtrl', ['$scope',
		function($scope) {
			window.onerror = function(err) {
				log('window.onerror: ' + err)
			};

			function connectWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false)
				}
			};
			connectWebViewJavascriptBridge(function(bridge) {
				//init初始化
				bridge.init(function(message, responseCallback) {
					var data = {
						'Javascript Responds': 'Wee!'
					};
					responseCallback(data);
				});
				//注册handler
				bridge.registerHandler('helpHandler', function(data, responseCallback) {
					$scope.$apply(function() {
						$scope.helpcontent = data;
					});
					responseData = {
						'Javascript Says': 'Right back atcha!'
					}
					responseCallback(responseData)
				})
			});
		}
	])