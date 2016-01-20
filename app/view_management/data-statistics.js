/**
 * Created by Lijingjing on 16/1/13.
 */
'use strict';

angular.module('myApp.chart', ['chart.js'])
    .factory('ChartService', ['$http', function ($http) {
        var restaurantBaseUrl = "http://202.120.40.175:21104";

        var searchOrderInfo = function (id, start, end) {
            return $http({
                method: "GET",
                url: restaurantBaseUrl + '/order/periodcount?restaurantId=' + id + '&date1=' + start + '&date2=' + end
            });
        };
        return {

            searchOrder: function (id, start, end) {
                return searchOrderInfo(id, start, end);
            }

        }

    }])
    .controller('ChartCtrl', function ($scope, $timeout, ChartService) {

        $scope.options = {
            showTooltips: true,
            tooltipCaretSize: 0,
            tooltipTemplate: function (label) {
                return "￥" + getTotalSales(label.label);
            }

        };


        function formatDate(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10)
                month = '0' + month;
            if (day < 10)
                day = '0' + day;
            var formatDate = year + '-' + month + '-' + day;
            return formatDate;
        }

        $scope.getStartDate = function (num) {
            var startDate = new Date(); //获取今天日期
            startDate.setDate(startDate.getDate() - num);
            return startDate;
        };

        $scope.startDate = formatDate($scope.getStartDate(7));
        $scope.endDate = formatDate($scope.getStartDate(1));
        $scope.myStart = $scope.startDate;
        $scope.myEnd = $scope.endDate;


        $scope.getOrderInfoByDays = function (start, end) {
            ChartService.searchOrder($.cookie('restaurantId'), start, end)
                .success(function (data) {
                    $scope.labels = [];
                    $scope.data = [];
                    $scope.data[0] = [];
                    $scope.totalSale = {};
                    for (var i = 0; i < data.length; i++) {
                        $scope.labels.push(data[i].dorderDate);
                        $scope.data[0].push(data[i].dorderFinishNum);
                        $scope.totalSale[data[i].dorderDate] = data[i].income;
                    }
                });
        };

        $scope.getOrderInfoByDays($scope.startDate, $scope.endDate);

        $scope.queryOrder = function (num) {
            $scope.startDate = formatDate($scope.getStartDate(num));
            $scope.endDate = formatDate($scope.getStartDate(1));
            $scope.myStart = $scope.startDate;
            $scope.myEnd = $scope.endDate;
            $("#start").val($scope.myStart);
            $("#end").val($scope.myEnd);
            $scope.data[0] = [];
            $scope.getOrderInfoByDays($scope.startDate, $scope.endDate);

        };


        function compareTime(startDate, endDate) {
            var start = new Date(startDate);
            var end = new Date(endDate);
            var startTime = start.getTime();
            var endTime = end.getTime();

            if (startTime - endTime > 0)
                return false;

            return true;

        }


        $scope.searchOrders = function () {
            $scope.startDate = $("#start").val();
            $scope.endDate = $("#end").val();
            $('.days').each(function () {
                $(this).removeClass("selectDays");
            });
            if (compareTime($scope.startDate, $scope.endDate)) {
                $scope.getOrderInfoByDays($scope.startDate, $scope.endDate);
            }
            else {
                alert("请选择正确的查询时间!");
            }


        };


        $scope.series = ['预订量'];


        function getTotalSales(value) {
            return $scope.totalSale[value];
        }


    });