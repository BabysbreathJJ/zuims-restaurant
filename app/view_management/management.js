/**
 * Created by Lijingjing on 15/12/10.
 */
'use strict';

angular.module('myApp.management', ['ngRoute', 'ngImgCrop', 'ngDialog', 'angular-sortable-view'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/management', {
            templateUrl: 'view_management/management.html',
            controller: 'ManagementCtrl'
        });
    }])
    .run(['$anchorScroll', function ($anchorScroll) {
        $anchorScroll.yOffset = 80;   // always scroll by 50 extra pixels
    }])
    .directive('changePic', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.bind('click', function () {
                    var imageList = angular.element(document.querySelector('#d-img'));
                    imageList.attr("src", attr.src);
                    scope.$apply(function () {
                        var description = angular.element(document.querySelector('#description'));
                        description.text(attr.description);
                    });
                });
            }
        };
    })
    .factory('ManageService', ['$http', 'BaseUrl', 'merchantPort', 'managementPort', 'userPort',function ($http, BaseUrl, merchantPort, managementPort, userPort) {
        //var restaurantBaseUrl = "http://202.120.40.175:21104";
        var restaurantBaseUrl = BaseUrl + merchantPort;

        //上传候选集
        var uploadHomePagePicRequest = function (imageInfo) {
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/restaurant/uploadCFrontImage',
                data: imageInfo,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        var uploadDetailPicRequest = function (imageInfo) {
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/restaurant/uploadCNormalImage',
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
                url: restaurantBaseUrl + '/restaurant/Cfrontimage/?id=' + restaurantId
            });
        };


        var getDetailRequest = function (restaurantId) {
            return $http({
                method: "GET",
                url: restaurantBaseUrl + '/restaurant/Cnormalimage?id=' + restaurantId
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
                url: restaurantBaseUrl + '/restaurant/linkman/update',
                data: linkmanInfo,
                dataType: {'Content-Type': 'application/json;charset=UTF-8'},
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

        var updatePwdRequest = function (pwdInfo) {
            return $http({
                method: "POST",
                url: restaurantBaseUrl + '/restaurant/changepwd',
                data: pwdInfo,
                crossDomain: true
            });
        };

        var getSellerInfoRequest = function () {
            return $http({
                method: "GET",
                url: BaseUrl + userPort + "/roles/marketing/users",
                crossDomain: true,
                headers: {
                    'Content-Type' : 'application/json;charset=UTF-8',
                    "authorization": "Basic YWRtaW46aW5jb25ncnVvdXM="
                }
            });
        }

        //By lty
        var newGetHomePageRequest = function (restaurantId) {
            return $http({
                method: "GET",
                url: restaurantBaseUrl + '/restaurant/frontimage/get?id=' + restaurantId
            });
        };

        var setFrontImageRequest = function (setInfo) {
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/restaurant/frontimage/set?id=' + setInfo.restaurantId
                    + '&pictureId=' + setInfo.pictureId,
                crossDomain: true
            });

        };

        var uploadCListImageRequest = function (imageInfo) {
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/restaurant/uploadCListImage',
                data: imageInfo,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        var getCListImageRequest = function (restaurantId){
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/restaurant/Clistimage?id=' + restaurantId,
                crossDomain: true
            });
        };

        var getListImageRequest = function (restaurantId){
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/restaurant/listimage/get?id=' + restaurantId,
                crossDomain: true
            });
        };

        var setListImageRequest = function(restaurantId, pictureId){
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/restaurant/listimage/set?id='
                    + restaurantId + '&pictureId=' + pictureId,
                crossDomain: true
            });
        };

        var deleteDetailRequest = function(pictureId) {
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/restaurant/image/delete?pictureId=' + pictureId
            });
        };

        var setDetailPicRequest = function(setInfo){
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/restaurant/normalimage/set',
                data: setInfo,
                crossDomain: true
            });
        }

        var getDetailShowPicRequest = function(restaurantId){
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/restaurant/normalimage/get?id='+restaurantId,
                crossDomain: true
            });
        }

        var getAllPicRequest = function(restaurantId) {
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/restaurant/Allnormalimage?id='+restaurantId,
                crossDomain: true
            });
        }

        var getMenuRequest = function(restaurantId){
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/menu/getFoodByRidGroupByCateId?rid=" + restaurantId,
                crossDomain: true
            });
        }

        var getCategoryRequest = function(restaurantId) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/menu/getCategory?rid=" + restaurantId,
                crossDomain: true
            });
        }

        var deleteFoodRequest = function(fid) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + '/menu/deleteFood?fid=' + fid,
                crossDomain: true,
                transformResponse: function (data, headersGetter, status) {
                    return {data: data};
                }
            });
        }

        var addFoodRequest = function(foodInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/menu/addFood',
                data: JSON.stringify(foodInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        }

        var editFoodRequest = function(foodInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/menu/editFood',
                data: JSON.stringify(foodInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        }

        var addCategoryRequest = function(cateInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/menu/addCategory',
                data: JSON.stringify(cateInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        }

        var editCategoryRequest = function(cateInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/menu/editCategory',
                data: JSON.stringify(cateInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        }

        var deleteCategoryRequest = function(cateId) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + '/menu/deleteCategory?cateId=' + cateId,
                crossDomain: true,
                transformResponse: function (data, headersGetter, status) {
                    return {data: data};
                }
            });
        }

        return {
            updatePwd: function (pwdInfo) {
                return updatePwdRequest(pwdInfo);
            },
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
            newGetHomePage: function(restaurantId) {
                return newGetHomePageRequest(restaurantId);
            },
            setFrontImage: function(setInfo) {
                return setFrontImageRequest(setInfo);
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
            updatePersisInfo: function (persistInfo) {
                return updatePersistInfoRequest(persistInfo);
            },
            getSellerInfo: function () {
                return getSellerInfoRequest();
            },
            uploadCListImage: function(imageInfo) {
                return uploadCListImageRequest(imageInfo);
            },
            deleteDetail: function(pictureId){
                return deleteDetailRequest(pictureId);
            },
            setDetailPic: function(setInfo){
                return setDetailPicRequest(setInfo);
            },
            getDetailShowPic: function(restaurantId){
                return getDetailShowPicRequest(restaurantId);
            },
            getCListImage: function(restaurantId){
                return getCListImageRequest(restaurantId);
            },
            getListImage: function(restaurantId){
                return getListImageRequest(restaurantId);
            },
            setListImage: function(restaurantId, pictureId){
                return setListImageRequest(restaurantId, pictureId);
            },
            getAllPic: function(restaurantId) {
                return getAllPicRequest(restaurantId);
            },
            getMenu: function(restaurantId){
                return getMenuRequest(restaurantId);
            },
            getCategory: function(restaurantId) {
                return getCategoryRequest(restaurantId);
            },
            deleteFood: function(fid) {
                return deleteFoodRequest(fid);
            },
            addFood: function(foodInfo) {
                return addFoodRequest(foodInfo);
            },
            editFood: function(foodInfo) {
                return editFoodRequest(foodInfo);
            },
            addCategory: function(cateInfo) {
                return addCategoryRequest(cateInfo);
            },
            editCategory: function(cateInfo) {
                return editCategoryRequest(cateInfo);
            },
            deleteCategory: function(cateId) {
                return deleteCategoryRequest(cateId);
            }
        }

    }])
    .controller('ManagementCtrl', function ($scope, $location, $anchorScroll, ManageService, ngDialog, BaseUrl, restaurantPort) {
        if ($.cookie("restaurantId") == null || $.cookie("restaurantId") == 'null' || $.cookie("restaurantId") == "" || $.cookie("restaurantId") == undefined) {
            window.location = $.cookie("loginPath");
        }
        var dialog;
        $scope.goto = function (x) {

            var newHash = x;
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash(x);
            } else {
                $anchorScroll();
            }
        };

        $("#logout").click(function () {
            $.cookie("restaurantId", null);
            window.location = $.cookie("loginPath");
        });
        if ($location.hash() == 'info-management') {
            console.log($location.hash());
            $scope.goto('info-management');
        }
        ManageService.getRestaurantInfo($.cookie("restaurantId"))
            .success(function (data) {
                //console.log(data);
                data.averagePrice = parseFloat(data.averagePrice, 10);
                $scope.restaurantInfo = data;
                $scope.basicInfo = data;
                $scope.persistInfo = {"persistTable": data.persistTable, "persistTime": data.persistTime};
                //delete $scope.basicInfo.introduction;
                //delete $scope.basicInfo.smoke;
                //delete $scope.basicInfo.images;
                //delete $scope.basicInfo.latitude;
                //delete $scope.basicInfo.longitude;
                $("#restaurantName").text($scope.basicInfo.hotelName + $scope.basicInfo.restaurantName);
                var sellerId = data.sellerId;
                var seller;
                ManageService.getSellerInfo()
                    .success(function (data) {
                        for(var i = 0; i < data.length; i++){
                            if(data[i].id == sellerId){
                                seller = data[i];
                                break;
                            }
                        }
                        if(seller == null){
                            $("#sellerName").text("暂无信息");
                            $("#sellerTel").text("暂无信息");
                            $("#sellerEmail").text("暂无信息");
                        }
                        else{
                            if (seller.fullName !== null)
                                $("#sellerName").text(seller.fullname);
                            else
                                $("#sellerName").text("暂无信息");
                            if (seller.mobile !== null)
                                $("#sellerTel").text(seller.mobile);
                            else
                                $("#sellerTel").text("暂无信息");
                            if (seller.email !== null)
                                $("#sellerEmail").text(seller.email);
                            else
                                $("#sellerEmail").text("暂无信息");

                        }
                    })
                    .error(function () {
                        $("#sellerName").text("暂无信息");
                        $("#sellerTel").text("暂无信息");
                        $("#sellerEmail").text("暂无信息");
                    });
            });


        //$scope.reservationNum = 20;
        //$scope.advanceTime = 4;

        $scope.$on('newRestaurantInfo', function (event, data) {
            $scope.restaurantInfo = data;
        });

        //首页图文信息预览
        $scope.previewHomePage = function () {
            ManageService.newGetHomePage($.cookie("restaurantId"))
                .success(function (data) {

                    $scope.restaurantInfo.homePagePic = data.picname;
                    $scope.restaurantInfo.restaurantTeles = $scope.restaurantInfo.restaurantTele.split(" ");
                    $scope.restaurantInfo.introduction = data.introduction;

                    if (data.picname == "" || data.picname == null)
                        $scope.restaurantInfo.homePagePic = BaseUrl + restaurantPort + "/restaurants/images?relativePath=NonePicture1.jpg";

                    $scope.discount = $scope.restaurantInfo.discountType == 'discount' ? true : false;
                    if ($scope.discount) {
                        $scope.restaurantInfo.homeOriginAveragePrice = $scope.restaurantInfo.averagePrice;
                        $scope.restaurantInfo.homeAveragePrice = Math.round(parseFloat($scope.restaurantInfo.homeOriginAveragePrice) * 0.67);
                    }
                    else {
                        $scope.restaurantInfo.homeAveragePrice = $scope.restaurantInfo.averagePrice;
                    }

                    ngDialog.open({
                        templateUrl: 'homePic.html',
                        scope: $scope
                    });
                });
        };

        $scope.editHomePage = function(){
            ManageService.newGetHomePage($.cookie("restaurantId"))
                .success(function(data){
                    $scope.FrontPic = data;
                });
            ManageService.getHomePage($.cookie("restaurantId"))
                .success(function(data){
                    $scope.FrontPics = data;
                });
            dialog = ngDialog.open({
                templateUrl: 'editFrontPic.html',
                scope: $scope,
                width: 600
            });
        };

        $scope.deleteCFront = function(detail){
            ManageService.deleteDetail(detail.pictureId)
                .success(function(data){
                    var index = $scope.FrontPics.indexOf(detail);
                    $scope.FrontPics.splice(index, 1);
                    alert("图片删除成功");
                });
        };

        $scope.setFront = function(detail){
            var setInfo = {};
            setInfo.restaurantId = $.cookie("restaurantId");
            setInfo.pictureId = detail.pictureId;
            ManageService.setFrontImage(setInfo)
                .success(function(data){
                    alert("首页图片设置成功");
                    var index = $scope.FrontPics.indexOf(detail);
                    $scope.FrontPics.splice(index, 1);
                    $scope.FrontPics.push($scope.FrontPic);
                    $scope.FrontPic = detail;
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

            if ($scope.picDescription == null) {
                alert('图片描述不能为空!');
                return;
            }

            /*if ($scope.picDescription.length > 20) {
                alert('图片描述不能超过20个字!');
                return;
            }*/

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
                        $scope.picDescription = "";
                        $scope.homePageShow = false;
                    }
                });
        };

        $scope.removePic = function () {
            $scope.homePageShow = false;
            $scope.myRecommendImage = '';
            $scope.picDescription = '';
            $scope.myRecommendCroppedPic = '';

        };

    })

    .controller('ImageListCtrl', function ($scope, ManageService, ngDialog, BaseUrl, restaurantPort) {
        $scope.uploadListImageShow = false;
        $scope.myListCroppedPic = '';
        $scope.myListImage = '';
        $scope.listPicDescription = '';
        var handleFileSelect = function (evt) {

            var target = (evt.currentTarget) ? evt.currentTarget : evt.srcElement;

            var file = target.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myListImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
            $scope.uploadListImageShow = true;

        };
        angular.element(document.querySelector('#InputListImage')).on('change', handleFileSelect);
        $scope.uploadPic = function () {
            $scope.begin = $scope.myListCroppedPic.indexOf("base64") + 7;
            $scope.myUploadPic = $scope.myListCroppedPic.substr($scope.begin);

            if ($scope.listPicDescription == null) {
                alert('图片描述不能为空!');
                return;
            }

            /*if ($scope.listPicDescription.length > 20) {
                alert('图片描述不能超过20个字!');
                return;
            }*/

            $scope.uploadPicInfo = {
                "imageValue": $scope.myUploadPic,
                "restaurantId": parseInt($.cookie("restaurantId")),
                "pictureIntro": $scope.listPicDescription
            };
            $scope.uploadInfo = JSON.stringify($scope.uploadPicInfo);
            ManageService.uploadCListImage($scope.uploadInfo)
                .success(function (data, status) {
                    if (data.success == true) {
                        alert("图片上传成功,可以点击首页图文信息预览进行查看!");
                        $scope.listPicDescription = "";
                        $scope.uploadListImageShow = false;
                    }
                });
        };
        $scope.removePic = function() {
            $scope.uploadListImageShow = false;
            $scope.myListImage = '';
            $scope.listPicDescription = '';
            $scope.myListCroppedPic = '';

        };
        $scope.editListPic = function() {
            ManageService.getCListImage($.cookie("restaurantId"))
                .success(function(data){
                    $scope.ListPics = data;
                });
            ManageService.getListImage($.cookie("restaurantId"))
                .success(function(data){
                    $scope.ListPic = data;
                });
            ngDialog.open({
                templateUrl: 'editListPic.html',
                scope: $scope,
                width: 600
            });
        };

        $scope.deleteCList = function(detail){
            ManageService.deleteDetail(detail.pictureId)
                .success(function(data){
                    var index = $scope.ListPics.indexOf(detail);
                    $scope.ListPics.splice(index, 1);
                    alert("图片删除成功");
                });
        };

        $scope.setList = function(detail){
            ManageService.setListImage($.cookie("restaurantId"), detail.pictureId)
                .success(function(data){
                    var index = $scope.ListPics.indexOf(detail);
                    $scope.ListPics.splice(index, 1);
                    $scope.ListPics.push($scope.ListPic);
                    $scope.ListPic = detail;
                    alert("列表图片展示成功");
                });
        };

        $scope.previewList = function(){
            ManageService.getListImage($.cookie("restaurantId"))
                .success(function(data){
                    $scope.listPic = data;
                    ngDialog.open({
                        templateUrl: 'previewList.html',
                        scope: $scope
                    });
                })
        }

    })

    .controller('ImageDetailCtrl', function ($scope, ManageService, ngDialog, BaseUrl, restaurantPort) {

        /*$scope.myDetailImage = '';
        $scope.myDetailCroppedImage = '';
        $scope.detailPicShow = false;
        var dialog;

        //详情图文信息预览
        $scope.previewDetail = function () {
            ManageService.getDetailShowPic($.cookie("restaurantId"))
                .success(function (data) {
                    $scope.details = data;

                    $scope.picLen = $scope.details.length;

                    if ($scope.picLen > 5)
                        $scope.details = $scope.details.slice(-5);
                    if ($scope.picLen > 0) {
                        $scope.discount = $scope.basicInfo.discountType == 'discount' ? true : false;
                        $scope.description = $scope.details[0].introduction;
                    }
                    else {
                        $scope.details = [];
                        $scope.details[0].picname = BaseUrl + restaurantPort + '/restaurants/images?relativePath=NonePicture2.jpg';
                    }
                    for (var i = 0; i < $scope.details.length; i++) {
                        $scope.details[i].picname = $scope.details[i].picname;
                    }

                    if ($scope.discount) {
                        $scope.restaurantInfo.detailOriginAveragePrice = $scope.restaurantInfo.averagePrice;
                        $scope.restaurantInfo.detailAveragePrice = Math.round(parseFloat($scope.restaurantInfo.detailOriginAveragePrice) * 0.67);

                        console.log($scope.restaurantInfo.detailOriginAveragePrice);
                    }
                    else {
                        $scope.restaurantInfo.detailAveragePrice = $scope.restaurantInfo.averagePrice;
                    }

                    ngDialog.open({
                        templateUrl: 'detailPic.html',
                        scope: $scope
                    });
                });
        };

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

            if ($scope.picDescription == null) {
                alert('图片描述不能为空!');
                return;
            }
            
            /*if ($scope.picDescription.length > 20) {
                alert('图片描述不能超过20个字!');
                return;
            }*/

            /*$scope.uploadPicInfo = {
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
                        $scope.picDescription = "";
                        $scope.detailPicShow = false;
                    }
                });
        };

        $scope.removePic = function () {
            $scope.myDetailImage = '';
            $scope.myDetailCroppedImage = '';
            $scope.picDescription = '';
            $scope.detailPicShow = false;
        };

        $scope.editDetail = function(){
            $scope.ltyAllPic = {};
            $scope.ltyAllPic.ShowPic = [];
            $scope.ltyAllPic.DetailPic = [];
            ManageService.getDetail($.cookie("restaurantId"))
                .success(function (data) {
                    $scope.ltyAllPic.DetailPic = data;
                });
            ManageService.getDetailShowPic($.cookie("restaurantId"))
                .success(function(data){
                    $scope.ltyAllPic.ShowPic = data;
                });
            dialog = ngDialog.open({
                templateUrl: 'editPic.html',
                scope: $scope,
                width: 600
            });
        };

        $scope.deletePic = function(detail){
            ManageService.deleteDetail(detail.pictureId)
                .success(function(data){
                    var index = $scope.ltyAllPic.DetailPic.indexOf(detail);
                    $scope.ltyAllPic.DetailPic.splice(index, 1);
                    alert("图片删除成功");
                });
        };

        $scope.showPic = function(detail){
            var index = $scope.ltyAllPic.DetailPic.indexOf(detail);
            $scope.ltyAllPic.DetailPic.splice(index, 1);
            $scope.ltyAllPic.ShowPic.push(detail);
        };

        $scope.cancelShowPic = function(show){
            var index = $scope.ltyAllPic.ShowPic.indexOf(show);
            $scope.ltyAllPic.ShowPic.splice(index, 1);
            $scope.ltyAllPic.DetailPic.push(show);
        };

        $scope.setDetail = function(){
            var setInfo = {};
            setInfo.restaurantId = $.cookie("restaurantId");
            setInfo.pictureIds = [];
            for(var i = 0; i < $scope.ltyAllPic.ShowPic.length; i++){
                setInfo.pictureIds.push($scope.ltyAllPic.ShowPic[i].pictureId);
            }
            ManageService.setDetailPic(setInfo)
                .success(function(data){
                    alert("修改成功");
                    dialog.close("editPic.html");
                });
        };*/

        $scope.myDetailImage = '';
        $scope.myDetailCroppedImage = '';
        $scope.detailPicShow = false;
        var dialog;

        var HandleFileSelect = function (evt) {

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

        angular.element(document.querySelector('#fileInputDetail')).on('change', HandleFileSelect);

        function getDetail() {
            $scope.ltyAllPic = {};
            $scope.ltyAllPic.DetailPic = [];

            ManageService.getDetailShowPic($.cookie("restaurantId"))
                .success(function (data) {
                    $scope.ltyAllPic.DetailPic = data;
                    if(data.length < 5) {
                        $scope.uploadShow = true;
                    }
                });
        }

        getDetail();

        $scope.uploadPic = function () {
            if($scope.ltyAllPic.DetailPic.length == 4) {
                $scope.uploadShow = false;
            }


            $scope.begin = $scope.myDetailCroppedPic.indexOf("base64") + 7;
            $scope.myUploadPic = $scope.myDetailCroppedPic.substr($scope.begin);

            if ($scope.picDescription == null) {
                alert('图片描述不能为空!');
                return;
            }
            
            /*if ($scope.picDescription.length > 20) {
                alert('图片描述不能超过20个字!');
                return;
            }*/

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
                        console.log(data);
                        alert("图片上传成功!");
                        $scope.picDescription = "";
                        $scope.detailPicShow = false;
                        getDetail();
                    }
                });
        };

        $scope.removePic = function () {
            $scope.myDetailImage = '';
            $scope.myDetailCroppedImage = '';
            $scope.picDescription = '';
            $scope.detailPicShow = false;
        };

        $scope.deletePic = function(detail){
            ManageService.deleteDetail(detail.pictureId)
                .success(function(data){
                    alert("图片删除成功");
                    getDetail();
                });
        };

        $scope.setDetail = function(){
            var setInfo = {};
            setInfo.restaurantId = $.cookie("restaurantId");
            setInfo.pictureIds = [];
            for(var i = 0; i < $scope.ltyAllPic.DetailPic.length; i++){
                setInfo.pictureIds.push($scope.ltyAllPic.DetailPic[i].pictureId);
            }
            ManageService.setDetailPic(setInfo)
                .success(function(data){
                    alert("修改成功");
                    getDetail();
                });
        };
    })
    .controller('ContactCtrl', function ($scope, ManageService) {

        function checkMobile(phone) {
            var sMobile = phone;
            if (!(/^1\d{10}$/.test(sMobile))) {
                alert(sMobile + "不是完整的11位手机号或者正确的手机号");
                return false;
            }
            return true;
        }

        function checkEMail(email) {
            var temp = email;
            //对电子邮件的验证
            var myreg = /^[0-9a-z][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}[0-9a-z]\.){1,4}[a-z]{2,4}$/;
            if (!myreg.test(temp)) {
                alert('提示\n请输入有效的邮箱址！\n' + temp + '不是正确的邮箱地址');
                return false;
            }
            return true;
        }

        ManageService.getLinkmanInfo($.cookie("restaurantId"))
            .success(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].priority == 1) {
                        $scope.selectContact = i;
                    }
                }
                $scope.contact = data;
            });


        $scope.updateContactInfo = function () {
            $scope.newContact = $scope.contact;
            for (var i = 0; i < $scope.contact.length; i++) {
                $scope.contact[i].restaurantId = parseInt($.cookie("restaurantId"));
                if (i == $scope.selectContact)
                    $scope.contact[$scope.selectContact].priority = 1;
                else
                    $scope.contact[i].priority = 2;
                delete $scope.contact[i].linkmanId;

                if ($scope.contact[i].linkmanPhone == "" || $scope.contact[i].linkmanName == "" || $scope.contact[i].linkmanEmail == "") {
                    $scope.newContact.splice(i, 1);
                }

                //邮箱验证
                if (!checkEMail($scope.contact[i].linkmanEmail))
                    return;
                //手机号码验证
                if (!checkMobile($scope.contact[i].linkmanPhone))
                    return;
            }

            if ($scope.newContact.length < 2) {
                alert("至少填写两位联系人详细信息!");
                return;
            }


            ManageService.updateLinkmanInfo($scope.contact)
                .success(function (data) {
                    alert("保存联系人信息成功!");
                });
        };

    })
    //.controller('BasicInfoCtrl', function ($scope, ManageService) {
    //
    //    $scope.saveBasicInfo = function () {
    //        ManageService.updateBasicInfo($scope.basicInfo)
    //            .success(function (data) {
    //                alert("信息保存成功!");
    //            });
    //    };
    //})
    .controller('PersistInfoCtrl', function ($scope, ManageService) {

        $scope.savePersistInfo = function () {

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
    .controller('PwdCtrl', function ($scope, ManageService) {


        $scope.updatePwd = function () {
            if ($scope.newPwd !== $scope.newPwdRepeat) {
                console.log($scope.newPwd);
                console.log($scope.newPwdRepeat);
                alert("两次新密码输入不一致!");
                return;
            }

            $scope.pwdInfo = {
                'restaurantId': parseInt($.cookie('restaurantId')),
                'newpwd': $scope.newPwd,
                'oldpwd': $scope.oldPwd
            };
            console.log($scope.pwdInfo);

            ManageService.updatePwd($scope.pwdInfo)
                .success(function (data) {
                    if (data.success == true) {
                        alert("密码修改成功!");
                        $scope.oldPwd = "";
                        $scope.newPwd = "";
                        $scope.newPwdRepeat = "";
                    }


                })
                .error(function (error) {
                    alert(error.message);
                })
            ;
        };

    });
    /*.controller('MenuCtrl', function ($scope, ngDialog, ManageService,BaseUrl, restaurantPort) {
        $scope.rowCollection = [];
        $scope.cateCollection = [];
        $scope.showMode = 0;

        $scope.menuImage = '';
        $scope.menuCroppedPic = '';
        $scope.menuPicShow = 0;
        $scope.isNewPic = 0;

        var handleFileSelect = function(evt) {
            $scope.menuPicShow = 1;
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function($scope){
                $scope.menuImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };

        angular.element(document.querySelector('#fileInputMenu')).on('change', handleFileSelect);

        function getMenu(){
            $scope.rowCollection = [];
            $scope.cateList = [];
            $scope.foodList = [];

            ManageService.getMenu($.cookie("restaurantId"))
                .success(function (menu) {
                    for(var i = 0;i < menu.cateList.length;i++) {
                        var menuOfCate = {
                            cate: menu.cateList[i],
                            foodList : menu.foodInfoList[i]
                        };
                        $scope.rowCollection.push(menuOfCate);
                    }
                });
        }

        function getCategory(){
            ManageService.getCategory($.cookie("restaurantId"))
                .success(function (cate) {
                    for(var i = 0;i < cate.length;i++) {
                        cate[i].isEditCate = 0;
                    }
                    $scope.cateCollection = cate;
                });
        }

        getMenu();
        getCategory();

        $scope.menuList = function() {
            getMenu();
            $scope.showMode = 0;
        }

        $scope.cate = function() {
            getCategory();
            $scope.showMode = 3;
        }

        $scope.addNewMenu = function(cate) {
            $scope.showMode = 2;
            $scope.showFood = {cateId: cate.cateId};
        }

        $scope.submitNewMenu = function(row) {
            var foodInfo = {
                cateId: row.cateId,
                foodDescription: row.foodDescription,
                foodName: row.foodName,
                foodPrice: row.foodPrice,
                picture: $scope.uploadPic,
                resId: $.cookie("restaurantId")
            };

            ManageService.addFood(foodInfo)
                .success(function (data) {
                    alert("上传成功!");
                    getMenu();
                    $scope.showMode = 0;
                    $scope.isNewPic = 0;
                });
        }

        $scope.deleteFood = function(row) {
            ManageService.deleteFood(row.fid)
                .success(function (data) {
                    alert("删除成功!");
                    getMenu();
                });
        }

        $scope.editFood = function(row) {
            $scope.showMode = 1;
            $scope.showFood = row;
        }

        $scope.updateMenu = function(row) {
            if($scope.isNewPic == 0) {
                var foodInfo = {
                    cateId: row.cateId,
                    fid: row.fid,
                    foodDescription: row.foodDescription,
                    foodName: row.foodName,
                    foodPrice: row.foodPrice,
                    isNewPic: 0,
                    resId: $.cookie("restaurantId")
                };
            }
            else if($scope.isNewPic == 1) {
                var foodInfo = {
                    cateId: row.cateId,
                    fid: row.fid,
                    foodDescription: row.foodDescription,
                    foodName: row.foodName,
                    foodPrice: row.foodPrice,
                    isNewPic: 1,
                    picture: $scope.uploadPic,
                    resId: $.cookie("restaurantId")
                };
            }
            
            ManageService.editFood(foodInfo)
                .success(function (data) {
                    alert("修改成功！");
                    $scope.isNewPic = 0;
                });
        }

        $scope.uploadPic = function() {
            $scope.showFood.pUrl = $scope.menuCroppedPic;
            $scope.menuPicShow = 0;
            $scope.isNewPic = 1;

            $scope.begin = $scope.menuCroppedPic.indexOf("base64") + 7;
            $scope.uploadPic = $scope.menuCroppedPic.substr($scope.begin);
            console.log($scope.uploadPic);
        }

        $scope.removePic = function() {
            $scope.menuImage = '';
            $scope.menuCroppedPic = '';
            $scope.menuPicShow = 0;
        }

        $scope.addNewCate = function() {
            ngDialog.open({
                templateUrl: 'addNewCate.html',
                scope: $scope
            });
        }

        $scope.submitNewCate = function() {
            var cateInfo = {
                cateName: document.getElementById("newCateName").value,
                resId: $.cookie("restaurantId")
            };

            ManageService.addCategory(cateInfo)
                .success(function (data) {
                    alert("新建分类成功！");
                    ngDialog.close();
                    getCategory();
                    getMenu();
                });
        }

        $scope.editCate = function(row) {
            row.isEditCate = 1;
        }

        $scope.updateCate = function(row) {
            var cateInfo = {
                cateId: row.cateId,
                cateName: row.cateName,
                resId: $.cookie("restaurantId")
            };

            ManageService.editCategory(cateInfo)
                .success(function (data) {
                    alert("修改成功！");
                    row.isEditCate = 0;
                });
        }

        $scope.deleteCate = function(row) {
            MangeService.deleteCategory(row.cateId)
                .success(function (data) {
                    alert("删除成功!");
                    getCategory();
                });
        }

    });*/