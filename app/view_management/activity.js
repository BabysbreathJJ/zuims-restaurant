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

        factory.deleteActivity = function(aid) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/activity/delete?id=" + aid,
                crossDomain: true
            });

        };

        return factory;
    }])
    .controller('ActivityCtrl', ['$scope', 'ngDialog', 'ActivityService', function ($scope, ngDialog, ActivityService) {

        $scope.allActivityCollection = [];
        $scope.myActivityCollection = [];
        $scope.showMode = 0;

        function getAllActivity(){
            ActivityService.getAllActivity()
                .success(function (activity) {
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

        }

        $scope.deleteActivity = function(row) {
            ActivityService.deleteActivity(row.id)
                .success(function(data) {
                    alert("删除成功！");
                    getMyActivity();
                })
        }

    }]);