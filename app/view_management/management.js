/**
 * Created by Lijingjing on 15/12/10.
 */
'use strict';

angular.module('myApp.management', ['ngRoute', 'ngImgCrop', 'ngDialog'])
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
    .factory('ManageService', ['$http', 'BaseUrl', 'merchantPort', 'managementPort', function ($http, BaseUrl, merchantPort, managementPort) {
        //var restaurantBaseUrl = "http://202.120.40.175:21104";
        var restaurantBaseUrl = BaseUrl + merchantPort;

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

        var getSellerInfoRequest = function (sellerId) {
            return $http({
                method: "GET",
                url: BaseUrl + managementPort + "/users/" + sellerId,
                crossDomain: true
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
            getSellerInfo: function (sellerId) {
                return getSellerInfoRequest(sellerId);
            }
        }

    }])
    .controller('ManagementCtrl', function ($scope, $location, $anchorScroll, ManageService, ngDialog, BaseUrl, restaurantPort) {
        if ($.cookie("restaurantId") == null || $.cookie("restaurantId") == "" || $.cookie("restaurantId") == undefined) {
            window.location = "/";
        }
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
            window.location = "/";
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
                delete $scope.basicInfo.introduction;
                delete $scope.basicInfo.smoke;
                delete $scope.basicInfo.images;
                delete $scope.basicInfo.latitude;
                delete $scope.basicInfo.longitude;
                $("#restaurantName").text($scope.basicInfo.hotelName + $scope.basicInfo.restaurantName);

                ManageService.getSellerInfo(data.sellerId).success(function (data) {
                        if (data.fullName !== null)
                            $("#sellerName").text(data.fullname);
                        else
                            $("#sellerName").text("暂无信息");
                        if (data.mobile !== null)
                            $("#sellerTel").text(data.mobile);
                        else
                            $("#sellerTel").text("暂无信息");
                        if (data.email !== null)
                            $("#sellerEmail").text(data.email);
                        else
                            $("#sellerEmail").text("暂无信息");
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
            ManageService.getHomePage($.cookie("restaurantId"))
                .success(function (data) {

                    $scope.restaurantInfo.homePagePic = BaseUrl + restaurantPort + data.picname;
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


            if ($scope.picDescription.length > 20) {
                alert('图片描述不能超过20个字!');
                return;
            }

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
    .controller('ImageDetailCtrl', function ($scope, ManageService, ngDialog, BaseUrl, restaurantPort) {

        $scope.myDetailImage = '';
        $scope.myDetailCroppedImage = '';
        $scope.detailPicShow = false;

        //详情图文信息预览
        ManageService.getDetail($.cookie("restaurantId"))
            .success(function (data) {
                $scope.details = data;
            });

        //详情图文信息预览
        $scope.previewDetail = function () {
            ManageService.getDetail($.cookie("restaurantId"))
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
                        $scope.details[i].picname = BaseUrl + restaurantPort + $scope.details[i].picname;
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

            if ($scope.picDescription.length > 20) {
                alert('图片描述不能超过20个字!');
                return;
            }

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
