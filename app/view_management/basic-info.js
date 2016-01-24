/**
 * Created by Lijingjing on 16/1/20.
 */
'use strict';

angular.module('myApp.basicInfo', [])
    .factory('BasicInfoService', ['$http', function ($http) {
        var restaurantBaseUrl = "http://202.120.40.175:21104";

        var authorizeRequest = function () {
            return $http({
                method: 'GET',
                url: 'http://202.120.40.175:21108/token',
                headers: {
                    authorization: "Basic " + btoa("panxin" + ":" + "panxin")
                }
            })

        };

        var getProductsInfoRequest = function () {
            return $http({
                method: 'GET',
                url: 'http://202.120.40.175:21108/productions',
                //headers: {
                //    'x-auth-token': token
                //},
                crossDomain: true
            });
        };

        var getCityInfoRequest = function () {
            return $http({
                method: 'GET',
                url: 'http://202.120.40.175:21108/cities',
                //headers: {
                //    'x-auth-token': token
                //},
                crossDomain: true
            });
        };


        var updateBasicInfoRequest = function (basicInfo) {
            return $http({
                method: "POST",
                url: restaurantBaseUrl + '/restaurant/info/basicinfoedit',
                data: basicInfo,
                crossDomain: true
            });
        };
        return {
            authorize: function () {
                return authorizeRequest();
            },
            updateBasicInfo: function (basicInfo) {
                return updateBasicInfoRequest(basicInfo);
            },
            getProducts: function (token) {
                return getProductsInfoRequest(token);
            },
            getCities: function (token) {
                return getCityInfoRequest(token)
            }

        }

    }])
    .controller('BasicInfoCtrl', function ($scope, BasicInfoService, $http) {
        $scope.saveBasicInfo = function () {
            BasicInfoService.updateBasicInfo($scope.basicInfo)
                .success(function (data) {
                    $("#restaurantName").text(data.restaurantName);
                    alert("信息保存成功!");
                });
        };


        //BasicInfoService.authorize().then(function (response) {
        //    $http.defaults.headers.common['x-auth-token'] = response.data.token;
        //    console.log(response.data.token);
            BasicInfoService.getProducts()
                .success(function (data) {
                    $scope.products = data;
                });

            BasicInfoService.getCities()
                .success(function (data) {
                    $scope.cities = data;
                });


        //});


    });
