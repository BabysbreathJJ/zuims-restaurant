/**
 * Created by Lijingjing on 15/12/16.
 */
'use strict';

angular.module("myApp.reservation", ['ngRoute', 'smart-table', 'ui-notification', 'ngDialog'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/reservation', {
            templateUrl: 'view_reservation/reservation.html',
            controller: 'ReservationCtrl'
        });
    }])
    .config([
        'ngDialogProvider',
        function(ngDialogProvider) {
            ngDialogProvider.setDefaults({
                className: 'ngdialog-theme-default',
                ariaAuto: false,
                ariaRole: false
            });
        }
    ])
    .controller("ReservationCtrl", ["$scope", "Notification", "ngDialog", function ($scope, Notification, ngDialog) {
        var orderNum = [, 'SH00002', 'SH00003', 'SH00004'];
        var orderState = ['未完成', '未完成', '未完成'];
        var orderDates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
        var id = 1;

        var items = [
            {
                orderNum: 'SH00001',
                orderState: '未完成',
                orderDate: '2015-12-17 14:28',
                orderTime: '晚餐',
                orderInfo: '李菁菁,女,15601861921,白金会员',
                orderPeopleNum: '3',
                orderAmount: '300',
                orderRemark: "",
                orderHandle: false
            },
            {
                orderNum: 'SH00002',
                orderState: '未完成',
                orderDate: '2015-12-17 14:29',
                orderTime: '晚餐',
                orderInfo: '李菁菁,女,15601861921,白金会员',
                orderPeopleNum: '3',
                orderAmount: '300',
                orderRemark: "",
                orderHandle: false
            },
            {
                orderNum: 'SH00003',
                orderState: '已完成',
                orderDate: '2015-12-17 14:30',
                orderTime: '晚餐',
                orderInfo: '李菁菁,女,15601861921,白金会员',
                orderPeopleNum: '3',
                orderAmount: '300',
                orderRemark: "",
                orderHandle: true
            }
        ];


        $scope.rowCollection = items;

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);


        //remove to the real data holder
        $scope.removeItem = function removeItem(row) {
            alert(JSON.stringify(row));
            var index = $scope.rowCollection.indexOf(row);
            if (index !== -1) {
                $scope.rowCollection.splice(index, 1);
            }
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
        $scope.notify = function () {
            var newScope = $scope.$new(true);
            //alertScope.title = 'Hello';
            newScope.name = "李菁菁" + $scope.notificationNum;
            newScope.phone = "156——" + $scope.notificationNum;
            newScope.level = "白金" + $scope.notificationNum;
            newScope.date = "2015-12-22&" + $scope.notificationNum;
            newScope.time = "18:15&" + $scope.notificationNum;
            newScope.peopleNum = "3";
            newScope.money = "300";
            newScope.remark = "测试";
            newScope.cancel = function(){
                //console.log("id"+$scope.notificationNum);
                //发送请求,将订单ID作为参数,取消订单的接口
                this.closeThisDialog();
                newScope.notification.then(function (notification) {
                    notification.kill(true);
                });
            };

            newScope.showConfirm = function () {
                ngDialog.open({
                    templateUrl: 'warning_message.html',
                    scope: newScope
                });
            };

            newScope.notification = Notification.warning({
                message: "test" + $scope.notificationNum,
                templateUrl: "custom_template.html",
                scope: newScope,
                delay: null
            });

            $scope.notificationNum++;
        };
    }]);