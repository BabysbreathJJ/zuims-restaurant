angular.module('myApp.menuManagement', ['ngDialog', 'moment-picker', 'ngImgCrop', 'angular-sortable-view'])
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
    .factory('MenuService', ['$http', 'BaseUrl', 'merchantPort', 'managementPort', function ($http, BaseUrl, merchantPort, managementPort) {
        var factory = {};

        factory.getMenu = function(restaurantId){
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/menu/getFoodByRidGroupByCateId?rid=" + restaurantId,
                crossDomain: true
            });
        };

        factory.getCategory = function(restaurantId) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/menu/getCategory?rid=" + restaurantId,
                crossDomain: true
            });
        };

        factory.deleteFood = function(fid) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + '/menu/deleteFood?fid=' + fid,
                crossDomain: true,
                transformResponse: function (data, headersGetter, status) {
                    return {data: data};
                }
            });
        };

        factory.addFood = function(foodInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/menu/addFood',
                data: JSON.stringify(foodInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.editFood = function(foodInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/menu/editFood',
                data: JSON.stringify(foodInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.addCategory = function(cateInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/menu/addCategory',
                data: JSON.stringify(cateInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.editCategory = function(cateInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/menu/editCategory',
                data: JSON.stringify(cateInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.deleteCategory = function(cateId) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + '/menu/deleteCategory?cateId=' + cateId,
                crossDomain: true,
                transformResponse: function (data, headersGetter, status) {
                    return {data: data};
                }
            });
        };

        return factory;
    }])
    .controller('MenuCtrl', ['$scope', 'ngDialog', 'MenuService', function ($scope, ngDialog, MenuService) {
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

        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        function getMenu(){
            $scope.rowCollection = [];
            $scope.cateList = [];
            $scope.foodList = [];

            MenuService.getMenu($.cookie("restaurantId"))
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
            MenuService.getCategory($.cookie("restaurantId"))
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

            MenuService.addFood(foodInfo)
                .success(function (data) {
                    alert("上传成功!");
                    getMenu();
                    $scope.showMode = 0;
                    $scope.isNewPic = 0;
                });
        }

        $scope.deleteFood = function(row) {
            MenuService.deleteFood(row.fid)
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
            
            MenuService.editFood(foodInfo)
                .success(function (data) {
                    alert("修改成功！");
                    $scope.isNewPic = 0;
                });
        }

        /*$scope.HandleFileSelect = function(files) {
            $scope.menuPicShow = 1;
            var reader = new FileReader(); 
            reader.readAsDataURL(files[0]);
            reader.onload = function(evt) {
                $scope.$apply(function(){
                    $scope.menuImage = evt.target.result;
                });
            };
        }*/

        $scope.uploadPic = function() {
            $scope.showFood.pUrl = $scope.menuCroppedPic;
            $scope.menuPicShow = 0;
            $scope.isNewPic = 1;

            $scope.begin = $scope.menuCroppedPic.indexOf("base64") + 7;
            $scope.uploadPic = $scope.menuCroppedPic.substr($scope.begin);
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

            MenuService.addCategory(cateInfo)
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

            MenuService.editCategory(cateInfo)
                .success(function (data) {
                    alert("修改成功！");
                    row.isEditCate = 0;
                });
        }

        $scope.deleteCate = function(row) {
            MenuService.deleteCategory(row.cateId)
                .success(function (data) {
                    alert("删除成功!");
                    getCategory();
                });
        }

    }]);