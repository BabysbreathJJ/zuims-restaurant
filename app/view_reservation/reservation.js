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
    .factory('OrderService', ['$http', function ($http) {
        var restaurantBaseUrl = "http://202.120.40.175:21104";

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
                url: restaurantBaseUrl + '/order/comfirmOrder?orderId=' + orderId + "&opt=" + opt
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
            }
        }

    }])
    .controller("ReservationCtrl", ["$scope", "Notification", "ngDialog", "OrderService", "$location", function ($scope, Notification, ngDialog, OrderService, $location) {

        alert($.cookie("restaurantId"));
        if ($.cookie("restaurantId") == null || $.cookie("restaurantId") == "" || $.cookie("restaurantId" == undefined)) {
            //alert($location.host());
            window.location = "/";
        }
        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        //$scope.displayedCollection = [].concat($scope.rowCollection);
        $scope.rowCollection = [];

        OrderService.getOrderInfo($.cookie("restaurantId"))
            .success(function (data) {
                console.log("所有数据---" + data);
                $scope.myNotifications = [];
                $scope.removeIndex = [];
                for (var i = 0; i < data.length; i++) {

                    var dateTime = data[i].orderTime.split(" ");
                    if (data[i].gender == 0) {
                        data[i].gender = "女";
                    }
                    else {
                        data[i].gender = "男";
                    }
                    data[i].orderDate = dateTime[0];
                    data[i].orderTimer = dateTime[1];

                    if (data[i].state == "已完成") {
                        data[i].orderHandled = true;
                        console.log("已完成——" + data[i]);
                    }
                    else if (data[i].state == "未确认") {
                        var index = data.indexOf(data[i]);
                        $scope.myNotifications.push(data[i]);
                        $scope.removeIndex.push(index);
                        console.log("未确认——" + data[i]);
                        continue;
                    }
                    else if (data[i].state == "已拒绝") {
                        data[i].orderHandled = true;
                    }
                    else {
                        data[i].orderHandled = false;
                        console.log("未完成-" + data[i].orderHandled);
                    }

                    $scope.rowCollection.push(data[i]);
                }

                for (var j = 0; j < $scope.removeIndex.length; j++) {
                    var index = $scope.removeIndex[j];
                    var dateTime = data[index].orderTime.split(" ");
                    $scope.notify(data[index]);
                }

            });


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
                console.log($scope.rowCollection);
            }
            OrderService.updateOrderState(row.orderId)
                .success(function (data) {
                    var dateTime = data.orderTime.split(" ");
                    data.orderDate = dateTime[0];
                    data.orderTimer = dateTime[1];
                    data.orderHandled = true;
                    $scope.rowCollection.push(data);
                });
        };

        $scope.notifications = [];
        $scope.notificationNum = 1;
        $scope.close = function () {
            console.log($scope.notifications.length);
            $scope.notifications[$scope.notifications.length - 1].then(function (notification) {
                notification.kill(true);
                $scope.notificationNum--;
                $scope.notifications.splice($scope.notifications.length - 1, 1)
            });
        };

        //推送开始
        var appId = '8d3bm5jtWzUowvOw2GJLqUxI-gzGzoHsz';
        var appKey = '4dTvIzaFOoHU6Xatd7rDIrvw';
        var push = AV.push({
            appId: appId,
            appKey: appKey
        });


        push.subscribe([$.cookie("restaurantId").toString()], function () {
            console.log('订阅成功！');
        });

        push.open(function () {
            console.log('连接服务器成功，可以接收推送');
        });

        // 监听推送消息
        push.on('message', function (data) {
            console.log(JSON.stringify(data));
            $scope.notify(data.order);
        });


        $scope.notify = function (order) {
            var newScope = $scope.$new(true);
            newScope.name = order.userLastName + order.userFirstName;
            newScope.phone = order.phoneId;
            newScope.level = order.userVipLevel;
            newScope.date = order.orderTime.split(" ")[0];
            newScope.time = order.orderTime.split(" ")[1];
            newScope.peopleNum = order.dinerNum;
            newScope.money = order.dorderSum;
            newScope.remark = order.more;
            //if(order.gender == 0){
            //    newScope.gender = "女";
            //}
            //else{
            //    newScope.gender = "男";
            //}
            console.log(newScope.gender);
            newScope.cancel = function () {
                //发送请求,将订单ID作为参数,取消订单的接口
                OrderService.acceptOrder(order.orderId, 0)
                    .success(function (data) {
                        var dateTime = data.orderTime.split(" ");
                        data.orderDate = dateTime[0];
                        data.orderTimer = dateTime[1];
                        data.orderHandled = true;
                        data.state = "已拒绝";
                        console.log("已拒绝——" + data);
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
                        data.orderTimer = dateTime[1];
                        data.orderHandled = false;
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