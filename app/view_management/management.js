/**
 * Created by Lijingjing on 15/12/10.
 */
'use strict';

angular.module('myApp.management', ['ngRoute', 'ngImgCrop', 'chart.js'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/management', {
            templateUrl: 'view_management/management.html',
            controller: 'ManagementCtrl'
        });
    }])
    .factory('UploadService', ['$http', function ($http) {
        var userBaseUrl = "http://202.120.40.175:21101";

        var uploadPicRequest = function (imageInfo) {
            return $http({
                method: 'POST',
                url: userBaseUrl + '/users/uploadImage',
                data: imageInfo,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };


        return {
            uploadPic: function (imageInfo) {
                return uploadPicRequest(imageInfo);
            }
        }

    }])
    .controller('ManagementCtrl', function ($scope, $location, $anchorScroll) {

        $scope.goto = function (id) {
            $location.hash(id);
            $anchorScroll();
        };

        $scope.reservationNum = 20;
        $scope.advanceTime = 4;

    })
    .controller('ImageRecommendCtrl', function ($scope, UploadService) {


        $scope.myRecommendImage = '';
        $scope.myRecommendCroppedPic = '';

        var handleFileSelect = function (evt) {
            var target = (evt.currentTarget) ? evt.currentTarget : evt.srcElement;;

            var file = target.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myRecommendImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInputRecommend')).on('change', handleFileSelect);

        $scope.uploadPic = function () {
            $scope.begin = $scope.myRecommendCroppedPic.indexOf("base64") + 7;
            $scope.myUploadPic = $scope.myRecommendCroppedPic.substr($scope.begin, 20);
            $scope.uploadPicInfo = {
                "imageValue": $scope.myUploadPic,
                "phoneId": "15601861921"
            };
            $scope.uploadInfo = JSON.stringify($scope.uploadPicInfo);
            //alert($scope.uploadInfo);
            UploadService.uploadPic($scope.uploadInfo)
                .success(function (data, status) {
                    console.log(data.success);
                });
        };

    })
    .controller('ImageDetailCtrl', function ($scope) {


        $scope.myDetailImage = '';
        $scope.myDetailCroppedImage = '';

        var handleFileSelect = function (evt) {
            var target = (evt.currentTarget) ? evt.currentTarget : evt.srcElement;;

            var file = target.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myDetailImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);

        };
        angular.element(document.querySelector('#fileInputDetail')).on('change', handleFileSelect);

    })
    .controller('ChartCtrl', function ($scope, $timeout) {

        $scope.options = {
            tooltipEvents: [],
            showTooltips: true,
            tooltipCaretSize: 0,
            tooltipTemplate: function (label) {
                return "￥" + getTotalSales(label.value);
            },
            onAnimationComplete: function () {
                console.log(this.datasets[0]);
                this.showTooltip(this.datasets[0].points, true);
            }
        };

        $scope.month = "十二月";
        $scope.labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
        $scope.series = ['预定量'];
        $scope.data = [
            [65, 50, 80, 81, 56, 55]
        ];


        $scope.totals = [
            [2000, 3000, 4000, 2000, 4000, 5000]
        ];

        function getTotalSales(value) {
            console.log(value);
            return parseInt(value) * 10;
        }

        // Simulate async data update
        $timeout(function () {
            $scope.data = [
                [28, 48, 40, 19, 86, 27, 90]
            ];
        }, 3000);

    });