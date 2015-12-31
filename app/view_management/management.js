/**
 * Created by Lijingjing on 15/12/10.
 */
'use strict';

angular.module('myApp.management', ['ngRoute', 'ngImgCrop', 'chart.js', 'ngDialog'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/management', {
            templateUrl: 'view_management/management.html',
            controller: 'ManagementCtrl'
        });
    }])
    .directive('changePic', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.bind('click', function () {
                    var imageList = angular.element(document.querySelector('#d-img'));
                    imageList.attr("src", attr.src);
                    scope.$apply(function () {
                        console.log(attr.description);
                        var description = angular.element(document.querySelector('#description'));
                        description.text(attr.description);
                    });
                });
            }
        };
    })
    .factory('ManageService', ['$http', function ($http) {
        var restaurantBaseUrl = "http://202.120.40.175:21104";

        var uploadHomePagePicRequest = function (imageInfo) {
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/restaurant/uploadFrontImage',
                data: imageInfo,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        var uploadDetailPicRequest = function (imageInfo) {
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/restaurant/uploadNormalImage',
                data: imageInfo,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        var getRestaurantRequest = function (restaurantId) {
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/restaurant/info?id=' + restaurantId
            });
        };

        var getHomePageRequest = function (restaurantId) {
            return $http({
                method: "GET",
                url: restaurantBaseUrl + '/restaurant/frontimage?id=' + restaurantId
            });
        };

        var getDetailRequest = function (restaurantId) {
            return $http({
                method: "GET",
                url: restaurantBaseUrl + '/restaurant/normalimage?id=' + restaurantId
            });
        };

        var getLinkmanInfosRequest = function (restaurantId) {
            return $http({
                method: "GET",
                url: restaurantBaseUrl + '/restaurant/linkman?id=' + restaurantId
            });
        };

        var updateLinkmanInfoRequest = function (linkmanInfo) {
            return $http({
                method: "POST",
                url: restaurantBaseUrl + '/restaurant/linkman/add',
                data: linkmanInfo,
                dataType: {'Content-Type': 'application/json;charset=UTF-8'},
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

        var updatePersistInfoRequest = function (persistInfo) {
            return $http({
                method: "POST",
                url: restaurantBaseUrl + '/restaurant/info/persistinfoedit',
                data: persistInfo,
                crossDomain: true
            });
        };

        return {
            uploadHomePagePic: function (imageInfo) {
                return uploadHomePagePicRequest(imageInfo);
            },
            uploadDetailPic: function (imageInfo) {
                return uploadDetailPicRequest(imageInfo);
            },
            getRestaurantInfo: function (restaurantId) {
                return getRestaurantRequest(restaurantId);
            },
            getHomePage: function (restaurantId) {
                return getHomePageRequest(restaurantId);
            },
            getDetail: function (restaurantId) {
                return getDetailRequest(restaurantId);
            },
            getLinkmanInfo: function (restaurantId) {
                return getLinkmanInfosRequest(restaurantId);
            },
            updateLinkmanInfo: function (linkmanInfo) {
                return updateLinkmanInfoRequest(linkmanInfo);
            },
            updateBasicInfo: function (basicInfo) {
                return updateBasicInfoRequest(basicInfo);
            },
            updatePersisInfo: function (persistInfo) {
                return updatePersistInfoRequest(persistInfo);
            }
        }

    }])
    .controller('ManagementCtrl', function ($scope, $location, $anchorScroll, ManageService, ngDialog) {
        if ($.cookie("restaurantId") == null || $.cookie("restaurantId") == "" || $.cookie("restaurantId") == undefined) {
            //alert($location.host());
            window.location = "/";
        }
        ManageService.getRestaurantInfo($.cookie("restaurantId"))
            .success(function (data) {
                //console.log(data);
                data.averagePrice = parseFloat(data.averagePrice, 10);
                $scope.restaurantInfo = data;
                $scope.basicInfo = data;
                $scope.persistInfo = {"persistTable": data.persistTable, "persistTime": data.persistTime};
                delete $scope.basicInfo.introduction;
                delete $scope.basicInfo.smoke;
                delete $scope.basicInfo.images;
                delete $scope.basicInfo.latitude;
                delete $scope.basicInfo.longitude;

            });

        $scope.goto = function (id) {
            $location.hash(id);
            $anchorScroll();
        };


        $scope.reservationNum = 20;
        $scope.advanceTime = 4;

        //首页图文信息预览
        $scope.previewHomePage = function () {
            ManageService.getHomePage($.cookie("restaurantId"))
                .success(function (data) {
                    $scope.restaurantInfo.homePagePic = data.picname;
                    $scope.restaurantInfo.restaurantTeles = $scope.restaurantInfo.restaurantTele.split(" ");
                    $scope.description = data.introduction;
                    $scope.discount = true;
                    ngDialog.open({
                        templateUrl: 'homePic.html',
                        scope: $scope
                    });
                });
        };


        //详情图文信息预览
        $scope.previewDetail = function () {
            ManageService.getDetail($.cookie("restaurantId"))
                .success(function (data) {
                    $scope.details = data;
                    $scope.discount = true;
                    $scope.description = data[0].introduction;
                    ngDialog.open({
                        templateUrl: 'detailPic.html',
                        scope: $scope
                    });
                });
        };

    })
    .controller('ImageRecommendCtrl', function ($scope, ManageService) {

        $scope.myRecommendImage = '';
        $scope.myRecommendCroppedPic = '';
        $scope.homePageShow = false;

        var handleFileSelect = function (evt) {
            var target = (evt.currentTarget) ? evt.currentTarget : evt.srcElement;

            var file = target.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myRecommendImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
            $scope.homePageShow = true;
        };
        angular.element(document.querySelector('#fileInputRecommend')).on('change', handleFileSelect);

        $scope.uploadPic = function () {
            $scope.begin = $scope.myRecommendCroppedPic.indexOf("base64") + 7;
            $scope.myUploadPic = $scope.myRecommendCroppedPic.substr($scope.begin);
            //alert(typeof($.cookie("restaurantId")));
            $scope.uploadPicInfo = {
                "imageValue": $scope.myUploadPic,
                "restaurantId": parseInt($.cookie("restaurantId")),
                "pictureIntro": $scope.picDescription
            };
            $scope.uploadInfo = JSON.stringify($scope.uploadPicInfo);
            ManageService.uploadHomePagePic($scope.uploadInfo)
                .success(function (data, status) {
                    if (data.success == true) {
                        alert("图片上传成功,可以点击首页图文信息预览进行查看!");
                        $scope.homePageShow = false;
                    }
                });
        };

        $scope.removePic = function () {
            $scope.homePageShow = false;
            $scope.myRecommendImage = '';
            $scope.myRecommendCroppedPic = '';

        };

    })
    .controller('ImageDetailCtrl', function ($scope, ManageService) {

        $scope.myDetailImage = '';
        $scope.myDetailCroppedImage = '';
        $scope.detailPicShow = false;

        var handleFileSelect = function (evt) {
            var target = (evt.currentTarget) ? evt.currentTarget : evt.srcElement;

            var file = target.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myDetailImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
            $scope.detailPicShow = true;

        };
        angular.element(document.querySelector('#fileInputDetail')).on('change', handleFileSelect);

        $scope.uploadPic = function () {
            $scope.begin = $scope.myDetailCroppedPic.indexOf("base64") + 7;
            $scope.myUploadPic = $scope.myDetailCroppedPic.substr($scope.begin);
            $scope.uploadPicInfo = {
                "imageValue": $scope.myUploadPic,
                "restaurantId": parseInt($.cookie("restaurantId")),
                "pictureIntro": $scope.picDescription
            };
            $scope.uploadInfo = JSON.stringify($scope.uploadPicInfo);
            //alert($scope.uploadInfo);
            ManageService.uploadDetailPic($scope.uploadInfo)
                .success(function (data, status) {
                    if (data.success == true) {
                        alert("图片上传成功,可以点击餐厅详细图文信息预览进行查看!");
                        $scope.detailPicShow = false;
                    }
                });
        };

        $scope.removePic = function () {
            $scope.myDetailImage = '';
            $scope.myDetailCroppedImage = '';
            $scope.detailPicShow = false;
        };

    })
    .controller('ContactCtrl', function ($scope, ManageService) {
        ManageService.getLinkmanInfo($.cookie("restaurantId"))
            .success(function (data) {
                $scope.contact = data;
            });

        $scope.updateContactInfo = function () {
            for (var i = 0; i < $scope.contact.length; i++) {
                $scope.contact[i].restaurantId = $.cookie("restaurantId");
            }
            console.log($scope.contact);
            ManageService.updateLinkmanInfo($scope.contact)
                .success(function (data) {
                    alert("保存联系人信息成功!");
                });
        };

    })
    .controller('BasicInfoCtrl', function ($scope, ManageService) {

        $scope.saveBasicInfo = function () {
            console.log($scope.basicInfo.discountType);
            $scope.temp = [];
            $scope.temp.push($scope.basicInfo.discountType);
            $scope.basicInfo.discountType = $scope.temp;
            console.log($scope.basicInfo);
            ManageService.updateBasicInfo($scope.basicInfo)
                .success(function (data) {
                    alert("信息保存成功!");
                });
        };
    })
    .controller('PersistInfoCtrl', function ($scope, ManageService) {

        $scope.savePersistInfo = function () {
            console.log($scope.persistInfo);

            $scope.newPersistInfo = {
                "persistTable": $scope.persistInfo.persistTable,
                "persistTime": $scope.persistInfo.persistTime,
                "restaurantId": $.cookie("restaurantId")
            };
            ManageService.updatePersisInfo($scope.newPersistInfo)
                .success(function (data) {
                    alert("自动接单设置保存成功!");
                });
        };

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
                //console.log(this.datasets[0]);
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
            //console.log(value);
            return parseInt(value) * 10;
        }

        // Simulate async data update
        $timeout(function () {
            $scope.data = [
                [28, 48, 40, 19, 86, 27, 90]
            ];
        }, 3000);

    });