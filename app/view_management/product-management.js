/**
 * Created by kubenetes on 16/6/30.
 */
angular.module('myApp.productManagement', ['ngDialog'])
    .controller('ProductCtrl', ['$scope', 'ngDialog', function ($scope, ngDialog) {

        //初始化下拉列表框
        function initSelectOptions(){
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
        };

        //初始化新产品参数
        function initNewProduct(){
            $scope.newProduct = {};
            $scope.newProduct.discounts = [];
            $scope.newProduct.discoutsTable = [];
            for(var i = 0; i < 48; i++){
                var temp = new Array();
                for(var j = 0; j < 7; j++){
                    temp.push(-1);
                }
                $scope.newProduct.discoutsTable.push(temp);
            }
        };

        //初始化添加折扣参数
        function initDiscount(){
            $scope.discount = {};
            $scope.discount.days = [false, false, false, false, false, false, false];
        };

        $scope.showMode = -1;
        initDiscount();
        initNewProduct();
        initSelectOptions();

        //添加产品
        $scope.addNewProduct = function(){
            $scope.showMode = 0;
            $scope.showProduct = $scope.newProduct;
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

        //保存添加的折扣
        $scope.saveNewDiscount = function(){
            $scope.addDiscountError = {};
            if($scope.discount.discount == undefined || $scope.discount.discount == null){
                $scope.addDiscountError.flag = true;
                $scope.addDiscountError.info = "请填写折扣额度";
                return;
            }
            //判断是否勾选折扣日期
            var temp = false;
            for(var i = 0; i < 7; i++){
                if($scope.discount.days[i] == true){
                    temp = true;
                    break;
                }
            }
            if(temp == false){
                $scope.addDiscountError.flag = true;
                $scope.addDiscountError.info = "请勾选折扣时间";
                return;
            }

            //判断起止时间是否合法
            if($scope.discount.beginTime == undefined || $scope.discount.beginTime == null
                || $scope.discount.endTime == undefined || $scope.discount.endTime == null
                || $scope.discount.beginTime.value >= $scope.discount.endTime.value){
                $scope.addDiscountError.flag = true;
                $scope.addDiscountError.info = "请正确填写折扣起止时间";
                return;
            }

            $scope.newProduct.discounts.push($scope.discount);
            initDiscount();
            ngDialog.close();
        };

        $scope.deleteDiscount = function(temp){
            var index = $scope.newProduct.discounts.indexOf(temp);
            $scope.newProduct.discounts.splice(index, 1);
        };

        //折扣格式化显示开始
        $scope.textDiscount = function(discount){
            var str = discount.toString();
            //$scope.textPrice =  " 计 " + (discount * $scope.newProduct.originPrice).toFixed(2) + " 元";
            if(str == "0"){
                return "免单";
            }
            else if(str == "1"){
                return "无折扣";
            }
            else if(str == "-1"){
                return "不出售"
            }
            else{
                var temp = str.substr(2, str.length);

                return temp + " 折";
            }
        };

        $scope.textPrice = function(discount, originPrice){
            return " 计 " + (discount * originPrice).toFixed(2) + " 元";
        };

        $scope.textDays = function(days){
            var temp = ["一", "二", "三", "四", "五", "六", "日"];
            var result = "周";
            for(var i = 0; i < 7; i++){
                if(days[i] == true){
                    result += temp[i] + "  ";
                }
            }
            return result;
        };

        $scope.textIntervals = function(begin, end){
            return begin.key + " 至 " + end.key;
        }
        //折扣格式化显示结束

        //把折扣写到折扣大表中,48*7!!!
        function parseDiscounts (array, table){
            for(var i = 0; i < 48; i++){
                for(var j = 0; j < 7; j++){
                    table[i][j] = -1;
                }
            }
            for(var i = 0; i < array.length; i++){
                for(var j = array[i].beginTime.value; j < array[i].endTime.value; j++){
                    for(var k = 0; k < 7; k++){
                        if(array[i].days[k] == true){
                            table[j][k] = array[i].discount;
                        }
                    }
                }
            }
        };

        $scope.previewDiscountTable = function(){
            parseDiscounts($scope.showProduct.discounts, $scope.showProduct.discoutsTable);
            console.log( $scope.newProduct.discoutsTable[0][0]);
            $scope.showDiscountTable = $scope.showProduct.discoutsTable;
            ngDialog.open({
                templateUrl: 'DiscountTable.html',
                scope: $scope,
                width: 700
            });
        };
    }]);