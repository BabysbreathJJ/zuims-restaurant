/**
 * Created by kubenetes on 16/6/30.
 */
angular.module('myApp.productManagement', ['ngDialog'])
    .controller('ProductCtrl', ['$scope', 'ngDialog',function ($scope, ngDialog) {

        //初始化下拉列表框
        $scope.showMode = -1;
        $scope.intervals = [];
        for(var i = 0; i < 24; i++){
            var str = "";
            str += "0";
            str += i;
            var temp = str.substr(str.length-2, 2);
            $scope.intervals.push({"key":temp + ":00", "value":2*i});
            $scope.intervals.push({"key":temp + ":30", "value":2*i+1});
        }
        $scope.intervals.push({"key":"24:00", "value":48});

        //初始化新产品参数
        $scope.newProduct = {};
        $scope.discounts = [];

        //添加产品
        $scope.addNewProduct = function(){
            $scope.showMode = 0;
            //初始化添加折扣参数
            $scope.discount = {};
            $scope.discount.days = [false, false, false, false, false, false, false, false];

            console.log($scope.newProduct);
        };

        //添加折扣,打开折扣编辑窗
        $scope.addDiscount = function(){
            //$scope.newProduct.discounts.push({});
            ngDialog.open({
                templateUrl: 'addNewDiscount.html',
                scope: $scope
            });

        };

        //保存折扣
        $scope.saveNewDiscount = function(){
            $scope.addDiscountError = {};
            if($scope.discount.discount == undefined || $scope.discount.discount == null){
                $scope.addDiscountError.flag = true;
                $scope.addDiscountError.info = "请填写折扣额度";
                return;
            }
            //判断是否勾选折扣日期
            var temp = false;
            for(var i = 1; i <=7; i++){
                if($scope.discount.days[i] == true){
                    temp = true;
                    break;
                }
            }
            if(temp == false){
                $scope.addDiscountError.flag = true;
                $scope.addDiscountError.info = "请勾选折扣时间";
            }

            if($scope.discount.beginTime == undefined || $scope.discount.beginTime == null
                || $scope.discount.endTime == undefined || $scope.discount.endTime == null
                || $scope.discount.beginTime.value >= $scope.discount.endTime.value){
                $scope.addDiscountError.flag = true;
                $scope.addDiscountError.info = "请正确填写折扣起止时间";
                return;
            }

            $scope.discounts.push($scope.discount);
            $scope.discount = {};
            $scope.discount.days = [false, false, false, false, false, false, false, false];
        };

        //折扣格式化显示
        $scope.textDiscount = function(discount){
            var str = discount.toString();
            if(str == "0"){
                return "免费";
            }
            else if(str == "1"){
                return "无折扣";
            }
            else{
                var temp = str.substr(2, str.length);
                return temp + " 折";
            }
        };


    }])