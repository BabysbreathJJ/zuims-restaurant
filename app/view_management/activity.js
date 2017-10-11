angular.module('myApp.activityManagement', ['ngDialog', 'moment-picker', 'ngImgCrop', 'angular-sortable-view'])
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
    .factory('ActivityService', ['$http', 'BaseUrl', 'merchantPort', 'managementPort', function ($http, BaseUrl, merchantPort, managementPort) {
        var factory = {};

        factory.getAllActivity = function(){
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/activity/getAll",
                crossDomain: true
            });
        };

        factory.getMyActivity = function(restaurantId) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/activity/getAllbyRestid?restid=" + restaurantId,
                crossDomain: true
            });
        };

        factory.checkActivity = function(aid, restaurantId) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/activity/check?aid=" + aid + "&restid=" + restaurantId,
                crossDomain: true
            });
        };

        factory.applyActivity = function(activityInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/activity/apply',
                data: JSON.stringify(activityInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.editActivity = function(activityInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/activity/edit',
                data: JSON.stringify(activityInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.deleteActivity = function(aid) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/activity/delete?id=" + aid,
                crossDomain: true
            });

        };

        factory.addActivity = function(activityInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/activity/add',
                data: JSON.stringify(activityInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.addActivityToPro = function(activityToProInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/activity/addPro',
                data: JSON.stringify(activityToProInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.deleteActivityToPro = function(id) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/activity/deletePro?id=" + id,
                crossDomain: true
            });

        };

        factory.getProByActivity = function(activityId){
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/activity/getProByActivity?activityId=" + activityId,
                crossDomain: true
            });
        };

        factory.getProduct = function(restaurantId){
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/product?restaurantId=" + restaurantId,
                crossDomain: true
            });
        };

        return factory;
    }])
    .controller('ActivityCtrl', ['$scope', 'ngDialog', 'ActivityService', function ($scope, ngDialog, ActivityService) {

        $scope.allActivityCollection = [];
        $scope.myActivityCollection = [];
        $scope.ProCollection = [];
        $scope.showMode = 0;
        $scope.isShow = 0;
        var activityId = -1;

        function getAllActivity(){
            ActivityService.getAllActivity()
                .success(function (activity) {
                    console.log(activity);
                    for (var i = 0; i < activity.length; i++) {
                        (function(i){
                            return ActivityService.checkActivity(activity[i].id,$.cookie("restaurantId")).success(function(status){
                                //console.log(status);
                                activity[i].status = status;
                            });
                        })(i)
                    }
                    $scope.allActivityCollection = activity;
                });
        }

        function getMyActivity() {
            ActivityService.getMyActivity($.cookie("restaurantId"))
                .success(function(activity) {
                    console.log(activity);
                    $scope.myActivityCollection = activity;
                });

        }

        getAllActivity();
        getMyActivity();

        $scope.allActivity = function() {
            $scope.showMode = 0;
        }

        $scope.myActivity = function() {
            $scope.showMode = 1;
        }

        $scope.applyActivity = function(row) {
            var activityInfo = {
                aid: row.id,
                rid: $.cookie(restaurantId)
            };

            ActivityService.applyActivity(activityInfo)
                .success(function(data) {
                    alert("参加成功！");
                    row.status = true;
                });
        }

        $scope.editActivity = function(row) {
            $scope.activityToHandle = {
                "content": row.content,
                "date": row.date,
                "id": row.id,
                "name": row.name,
                "state": row.state,
                "type": row.type
            };

            ngDialog.open({
                templateUrl: 'edit_activity.html',
                scope: $scope
            });
        }

        $scope.updateActivity = function() {
            ActivityService.editActivity($scope.activityToHandle)
                .success(function(data) {
                    alert("修改成功！");
                    getMyActivity();
                    ngDialog.close();
                })
        }

        $scope.addActivity = function() {
            $scope.activityToHandle = {
                "content": "",
                "date": "",
                "name": "",
                "type": $.cookie("restaurantId"),
            };

            ngDialog.open({
                templateUrl: 'add_activity.html',
                scope: $scope
            });
        };

        $scope.submitActivity = function() {
            ActivityService.addActivity($scope.activityToHandle)
                .success(function(data) {
                    alert("提交成功！");
                    getMyActivity();
                    ngDialog.close();
                })
        };


        $scope.deleteActivity = function(row) {
            ActivityService.deleteActivity(row.id)
                .success(function(data) {
                    alert("删除成功！");
                    getMyActivity();
                })
        };

        $scope.proToActivity = function(row) {
            activityId = row.id;
            ActivityService.getProByActivity(row.id)
                .success(function (data) {
                    $scope.ProCollection = data;
                });

            ngDialog.open({
                templateUrl: 'proToActivity.html',
                scope: $scope
            });
        };

        $scope.deleteProToActivity = function(row) {
            ActivityService.deleteActivityToPro(row.id)
                .success(function(data) {
                    alert("删除成功！");
                    ActivityService.getProByActivity(row.activityId)
                        .success(function (data) {
                            $scope.ProCollection = data;
                        });
                })
        };

        $scope.showAddPro = function() {

            $scope.ProToHandle = {
                "activityId": activityId,
                "productId": ""
            };

            $scope.isShow = 1;
            ActivityService.getProduct($.cookie("restaurantId"))
                .success(function (product) {
                    var proList = $scope.ProCollection;
                    for (var i = 0; i < proList.length; i++) {
                        for (var j = 0; j < product.length; j++) {
                            if(product[j].productId == proList[i].productId){
                                product.splice(j, 1);
                                j = j-1;
                            }
                        }
                    }
                    $scope.productCollection = product;
                });
        };

        $scope.addPro = function () {

            if ($scope.ProToHandle.productId != "") {
                ActivityService.addActivityToPro($scope.ProToHandle)
                    .success(function () {
                        alert("添加成功！");
                        $scope.isShow = 0;
                        ActivityService.getProByActivity(activityId)
                            .success(function (data) {
                                $scope.ProCollection = data;
                            });
                    });
            }
            else {
                $scope.isShow = 0;
            }
        }

    }]);