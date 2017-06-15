/**
 * Created by Lijingjing on 16/1/20.
 */
'use strict';

angular.module('myApp.basicInfo', ['monospaced.qrcode',])
    .factory('BasicInfoService', ['$http', 'BaseUrl', 'merchantPort', 'managementPort', function ($http, BaseUrl, merchantPort, managementPort) {
        var restaurantBaseUrl = BaseUrl + merchantPort;

        //var authorizeRequest = function () {
        //    return $http({
        //        method: 'GET',
        //        url: 'http://202.120.40.175:21108/token',
        //        headers: {
        //            authorization: "Basic " + btoa("panxin" + ":" + "panxin")
        //        }
        //    })
        //
        //};

        var getProductsInfoRequest = function () {
            return $http({
                method: 'GET',
                url: BaseUrl+managementPort+'/productions',
                //headers: {
                //    'x-auth-token': token
                //},
                crossDomain: true
            });
        };

        var getCityInfoRequest = function () {
            return $http({
                method: 'GET',
                url: BaseUrl+managementPort+'/cities',
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
    .controller('BasicInfoCtrl', function ($scope, BasicInfoService) {
        $scope.codeUrl = "https://ka.bestfood.cc/details.html?id="+$.cookie("restaurantId");
        $scope.codeHref = "https://ka.bestfood.cc/details.html?id="+$.cookie("restaurantId");
        $scope.saveBasicInfo = function () {
            BasicInfoService.updateBasicInfo($scope.basicInfo)
                .success(function (data) {
                    $("#restaurantName").text(data.hotelName +data.restaurantName);
                    $scope.basicInfo = data;
                    $scope.$emit('newRestaurantInfo', data);
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
