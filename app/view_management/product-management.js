/**
 * Created by kubenetes on 16/6/30.
 */
angular.module('myApp.productManagement', [])
    .controller('ProductCtrl', ['$scope', function ($scope) {
        $scope.showMode = -1;
        $scope.newProduct = {};
        $scope.addNewProduct = function(){
            $scope.showMode = 0;
            console.log($scope.newProduct);
        }

    }])