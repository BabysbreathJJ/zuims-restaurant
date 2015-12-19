/**
 * Created by Lijingjing on 15/12/10.
 */
'use strict';

angular.module('myApp.management', ['ui.router', 'ngImgCrop'])
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('management', {
                url: '/management',
                templateUrl: 'view_management/management.html',
                controller: 'ManagementCtrl'
            })


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

    })
    .controller('ImageRecommendCtrl', function ($scope, UploadService) {


        $scope.myRecommendImage = '';
        $scope.myRecommendCroppedPic = '';

        var handleFileSelect = function (evt) {

            var file = evt.currentTarget.files[0];
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

            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myDetailImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);

        };
        angular.element(document.querySelector('#fileInputDetail')).on('change', handleFileSelect);

    });