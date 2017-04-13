/**
 * Created by Lijingjing on 15/12/16.
 */
'use strict';

angular.module("myApp.reservation", ['ngRoute', 'smart-table', 'ui-notification', 'ngDialog'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/reservation', {
            templateUrl: 'view_reservation/reservation.html',
            controller: 'ReservationCtrl'
        });
    }])
    .config([
        'ngDialogProvider',
        function (ngDialogProvider) {
            ngDialogProvider.setDefaults({
                className: 'ngdialog-theme-default',
                ariaAuto: false,
                ariaRole: false
            });
        }
    ])
    .factory('OrderService', ['$http', 'BaseUrl', 'merchantPort', function ($http, BaseUrl, merchantPort) {
        var restaurantBaseUrl = BaseUrl + merchantPort;
        //var restaurantBaseUrl = "http://202.120.40.175:21104";
        var didi = "http://123.125.253.29:80";

        var getOderInfosRequest = function (restaurantId) {
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/order/infoByrestaurantid?restaurantId=' + restaurantId
            });
        };

        var updateOrderStateRequest = function (orderId) {
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/order/finishOrder?orderId=' + orderId
            });
        };

        var acceptOrderRequest = function (orderId, opt) {
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/order/confirmOrder?orderId=' + orderId + "&opt=" + opt
            });
        };

        var getDidiStatusRequest = function (orderId) {
          return $http({
            method:'GET',
            url:restaurantBaseUrl + "/order/ddstatusByorderid?orderId=" + orderId
          });
        };

        var getShopIdRequest = function(restaurantId) {
          return $http({
            method:'GET',
            url:restaurantBaseUrl + "/didi/getShopId?restaurantId=" + restaurantId
          });
        };

        var didiConfirmRequest = function(cavInfo) {
          return $http({
            method:'POST',
            url:restaurantBaseUrl + "/order/ddConfirm",
            data:JSON.stringify(cavInfo),
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
            crossDomain:true
          });
        };

        return {
            getOrderInfo: function (restaurantId) {
                return getOderInfosRequest(restaurantId);
            },
            updateOrderState: function (orderId) {
                return updateOrderStateRequest(orderId);
            },
            acceptOrder: function (orderId, opt) {
                return acceptOrderRequest(orderId, opt);
            },
            getDidiStatus: function (orderId) {
              return getDidiStatusRequest(orderId);
            },
            getShopId : function (restaurantId) {
              return getShopIdRequest(restaurantId);
            },
            didiConfirm: function (cavInfo) {
              return didiConfirmRequest(cavInfo);
            }
            /*confirmCoupon : function (token,appId,logId,couponCode,OrderInfo) {
              return confirmCouponRequest(token,appId,logId,couponCode,OrderInfo);
            }*/
        }

    }])
    .controller("ReservationCtrl", ["$scope", "Notification", "ngDialog", "OrderService", "$location", function ($scope,Notification, ngDialog, OrderService, $location) {

        if ($.cookie("restaurantId") == null || $.cookie("restaurantId") == "" || $.cookie("restaurantId") == undefined) {
            window.location = $.cookie("loginPath");
        }
        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        //$scope.displayedCollection = [].concat($scope.rowCollection);
        $scope.rowCollection = [];
        $scope.todayCollection = [];
        $scope.handleCollection = [];
        $scope.showMode = 0;

        OrderService.getOrderInfo($.cookie("restaurantId"))
            .success(function (order) {
                //console.log("所有数据---" + data);
                $scope.myNotifications = [];
                $scope.removeIndex = [];

                var myDate = new Date();

                for (var i = 0; i < order.length; i++) {
                  //console.log(i);

                  (function(i){
                    return OrderService.getDidiStatus(order[i].orderId).success(function(status){
                      if(status.didi == "didi") {
                        order[i].source = "滴滴";
                        order[i].isDidi = true;
                      }
                      else {
                        order[i].isDidi = false;
                      }
                    });
                  })(i)

                    var dateTime = order[i].orderTime.split(" ");
                    if (order[i].gender == 0) {
                        order[i].gender = "女";
                    }
                    else {
                        order[i].gender = "男";
                    }
                    order[i].orderDate = dateTime[0];
                    order[i].orderTimer = dateTime[1].substr(0, 5);

                    if (order[i].state == "已就餐") {
                        order[i].orderHandled = true;
                        //console.log("已完成——" + data[i]);

                    }
                    else if (order[i].state == "待确认") {
                        var index = order.indexOf(order[i]);
                        $scope.myNotifications.push(order[i]);
                        $scope.removeIndex.push(index);
                        console.log("未确认——" + data[i]);

                        $scope.handleCollection.push(order[i]);

                        continue;
                    }
                    else if (order[i].state == "已拒绝") {
                        order[i].orderHandled = true;
                    }
                    else if (order[i].state == "已取消") {
                      order[i].orderHandled = true;
                    }
                    else {
                        order[i].orderHandled = false;
                        //console.log("未完成-" + data[i].orderHandled);
                    }

                    $scope.rowCollection.push(order[i]);

                    if(order[i].orderDate==myDate.getYear()+"-"+myDate.getMonth()+"-"+myDate.getDay()){
                        $scope.todayCollection.push(order[i]);
                    }
                }

                for (var j = 0; j < $scope.removeIndex.length; j++) {
                    var index = $scope.removeIndex[j];
                    var dateTime = order[index].orderTime.split(" ");
                    $scope.notify(order[index]);
                }

            });

        $scope.allOrder = function() {
            $scope.showMode = 0;
        }

        $scope.todayOrder = function() {
            $scope.showMode = 1;
        }

        $scope.handleOrder = function() {
            $scope.showMode = 2;
        }

        //remove to the real data holder
        $scope.removeItem = function removeItem(row) {
            alert(JSON.stringify(row));
            var index = $scope.rowCollection.indexOf(row);
            if (index !== -1) {
                $scope.rowCollection.splice(index, 1);
            }
        };

        //完成订单
        $scope.completeOrder = function (row) {
            var index = $scope.rowCollection.indexOf(row);
            if (index !== -1) {
                $scope.rowCollection.splice(index, 1);
                //console.log($scope.rowCollection);
            }
            OrderService.updateOrderState(row.orderId)
                .success(function (data) {
                    var dateTime = data.orderTime.split(" ");
                    data.orderDate = dateTime[0];
                    data.orderTimer = dateTime[1].substr(0, 5);
                    data.orderHandled = true;
                    $scope.rowCollection.push(data);
                });
        };

        $scope.completeDidiOrder = function(row) {
          var newScope = $scope.$new(true);

          ngDialog.open({
              templateUrl: 'complete_didi_order.html',
              scope: newScope
          });

          newScope.confirm = function () {
            OrderService.getShopId($.cookie("restaurantId")).success(function(orderInfo) {
              var cavInfo = {orderId:"",appId:"",token:"",logId:"",couponCode:"",shopId:"",merchantId:"",cavUserName:""};
              cavInfo.orderId = row.orderId;
              cavInfo.couponCode = document.getElementById("couponCode").value;
              cavInfo.shopId = orderInfo.shopId + "";
              cavInfo.merchantId = orderInfo.merchantId + "";
              cavInfo.cavUserName = "最美食";

              OrderService.didiConfirm(cavInfo).success(function(data) {
                if(data == true ) {
                  alert("核销成功！");
                  OrderService.updateOrderState(row.orderId)
                      .success(function (data) {
                          var dateTime = data.orderTime.split(" ");
                          data.orderDate = dateTime[0];
                          data.orderTimer = dateTime[1].substr(0, 5);
                          data.orderHandled = true;
                          $scope.rowCollection.push(data);
                      });
                }
                else {
                  alert("核销失败！");
                }
              });

            });
            newScope.$destroy();
          }
        }

        $scope.notifications = [];
        $scope.notificationNum = 1;
        $scope.close = function () {
            //console.log($scope.notifications.length);
            $scope.notifications[$scope.notifications.length - 1].then(function (notification) {
                notification.kill(true);
                $scope.notificationNum--;
                $scope.notifications.splice($scope.notifications.length - 1, 1)
            });
        };

        //推送开始
        var appId = '6HR0iwp5ALyvLRHtq70BhYy8-gzGzoHsz';
        var appKey = 'HmiHqJ9dJ3O26BP5V175HdG8';
        var push = AV.push({
            appId: appId,
            appKey: appKey
        });


        push.subscribe([$.cookie("restaurantId").toString()], function () {
            //console.log('订阅成功！');
        });

        push.open(function () {
            //console.log('连接服务器成功，可以接收推送');
        });

        // 监听推送消息
        push.on('message', function (data) {
            //console.log(JSON.stringify(data));
            if (data.order.state == '待确认')
                $scope.notify(data.order);
            else {

                data.order.orderDate = data.order.orderTime.split(" ")[0];
                data.order.orderTimer = data.order.orderTime.split(" ")[1].substr(0, 5);
                data.order.orderHandled = false;
                if (data.order.gender == 0) {
                    data.order.gender = "女";
                }
                else {
                    data.order.gender = "男";
                }
                $scope.rowCollection.push(data.order);
                $scope.$apply();
            }
        });


        $scope.notify = function (order) {
            var newScope = $scope.$new(true);
            if (order.userFirstName == undefined || order.userFirstName == null) {
                newScope.name = order.userLastName;
            }
            else
                newScope.name = order.userLastName + order.userFirstName;
            newScope.phone = order.phoneId;
            newScope.level = order.userVipLevel;
            newScope.date = order.orderTime.split(" ")[0];
            newScope.time = order.orderTime.split(" ")[1].substr(0, 5);
            newScope.peopleNum = order.dinerNum;
            newScope.money = order.dorderSum;
            newScope.remark = order.more;

            newScope.cancel = function () {
                //发送请求,将订单ID作为参数,取消订单的接口
                OrderService.acceptOrder(order.orderId, 0)
                    .success(function (data) {
                        var dateTime = data.orderTime.split(" ");
                        data.orderDate = dateTime[0];
                        data.orderTimer = dateTime[1].substr(0, 5);
                        data.orderHandled = true;
                        data.state = "已拒绝";
                        if (data.gender == 0) {
                            data.gender = "女";
                        }
                        else {
                            data.gender = "男";
                        }

                        $scope.rowCollection.push(data);
                        newScope.notification.then(function (notification) {
                            notification.kill(true);
                        });
                    });

                this.closeThisDialog();
                newScope.notification.then(function (notification) {
                    notification.kill(true);
                });
            };

            newScope.accept = function () {
                OrderService.acceptOrder(order.orderId, 1)
                    .success(function (data) {
                        var dateTime = data.orderTime.split(" ");
                        data.orderDate = dateTime[0];
                        data.orderTimer = dateTime[1].substr(0, 5);
                        data.orderHandled = false;
                        if (data.gender == 0) {
                            data.gender = "女";
                        }
                        else {
                            data.gender = "男";
                        }
                        $scope.rowCollection.push(data);
                        newScope.notification.then(function (notification) {
                            notification.kill(true);
                        });
                    });
            };

            newScope.showConfirm = function () {
                ngDialog.open({
                    templateUrl: 'warning_message.html',
                    scope: newScope
                });
            };

            newScope.notification = Notification.warning({
                message: "新订单" + $scope.notificationNum,
                templateUrl: "custom_template.html",
                scope: newScope,
                delay: null
            });

            $scope.notificationNum++;
        };

        //    推送结束
    }]);
