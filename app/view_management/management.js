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
    .factory('ManagementService', ['$http', 'userBaseUrl', function ($http, userBaseUrl) {
        //var baseUrl = "http://202.120.40.175:21102";

        var getUserInfolRequest = function (phone) {
            return $http({
                method: 'GET',
                url: userBaseUrl + '/users/userInfo?phone=' + phone,
                crossDomain: true
            });
        };

        var saveuserInfoRequest = function (phone, formData) {
            return $http({
                method: "POST",
                url: userBaseUrl + '/users/userinfocomplete?phone=' + phone,
                data: JSON.stringify(formData),
                headers: {'Content-Type': 'application/json'},
                crossDomain: true
            });
        };

        return {
            getUserInfo: function (phone) {
                return getUserInfolRequest(phone);
            },
            saveUserInfo: function (phone, formData) {
                return saveuserInfoRequest(phone, formData);
            }
        }

    }])
    .controller('ManagementCtrl', function ($scope, $location, $anchorScroll) {

        $scope.goto = function (id) {
            $location.hash(id);
            $anchorScroll();
        };

    })
    .controller('ImageRecommendCtrl', function ($scope) {


        $scope.myRecommendImage = '';
        $scope.myRecommendCroppedImage = '';

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