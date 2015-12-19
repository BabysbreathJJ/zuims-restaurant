/**
 * Created by Lijingjing on 15/12/16.
 */
'use strict';

angular.module("myApp.reservation", ['ui.router', 'smart-table'])
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('reservation', {
                url: '/reservation',
                templateUrl: 'view_reservation/reservation.html',
                controller: 'ReservationCtrl'
            })


    }])
    
    .controller("ReservationCtrl", ["$scope", function ($scope) {
        var orderNum = [, 'SH00002', 'SH00003', 'SH00004'];
        var orderState = [ '未完成', '未完成', '未完成'];
        var orderDates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
        var id = 1;

        var items =[
            {
                orderNum : 'SH00001',
                orderState : '未完成',
                orderDate : '2015-12-17 14:28',
                orderTime : '晚餐',
                orderInfo : '李菁菁,女,15601861921,白金会员',
                orderPeopleNum : '3',
                orderAmount : '300',
                orderRemark : "",
                orderHandle : false
            },
            {
                orderNum : 'SH00002',
                orderState : '未完成',
                orderDate : '2015-12-17 14:29',
                orderTime : '晚餐',
                orderInfo : '李菁菁,女,15601861921,白金会员',
                orderPeopleNum : '3',
                orderAmount : '300',
                orderRemark : "",
                orderHandle : false
            },
            {
                orderNum : 'SH00003',
                orderState : '已完成',
                orderDate : '2015-12-17 14:30',
                orderTime : '晚餐',
                orderInfo : '李菁菁,女,15601861921,白金会员',
                orderPeopleNum : '3',
                orderAmount : '300',
                orderRemark : "",
                orderHandle : true
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
        }
    }]);