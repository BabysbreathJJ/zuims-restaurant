/**
 * Created by kubenetes on 16/6/30.
 */
angular.module('myApp.productManagement', ['ngDialog', 'moment-picker'])
    .factory('ProductService', ['$http', 'BaseUrl', 'merchantPort', 'managementPort', function ($http, BaseUrl, merchantPort, managementPort) {
        var factory = {};
        factory.addProduct = function(data){
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + "/product/add",
                data: JSON.stringify(data),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
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
        factory.deleteProduct = function(productId){
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/product/delete?productId=" + productId,
                crossDomain: true
            });
        };
        factory.editProduct = function(product){
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + "/product/edit",
                data: JSON.stringify(product),
                crossDomain: true
            });
        };
        factory.addPromotion = function(promotion){
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + "/product/promotion/add",
                data: JSON.stringify(promotion),
                crossDomain: true
            });
        };
        factory.deletePromotion = function(promotionId){
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/product/promotion/delete?id=" + promotionId,
                crossDomain: true
            });
        };
        return factory;
    }])
    .controller('ProductCtrl', ['$scope', 'ngDialog', 'ProductService', function ($scope, ngDialog, ProductService) {

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
            data = {};
            data.discounts = [];
            data.discoutsTable = [];
            data.promotions = [];
            for(var i = 0; i < 48; i++){
                var temp = new Array();
                for(var j = 0; j < 7; j++){
                    temp.push(-1);
                }
                data.discoutsTable.push(temp);
            }
            return data;
        };

        //初始化添加折扣参数
        function initDiscount(){
            $scope.discount = {};
            $scope.discount.days = [false, false, false, false, false, false, false];
        };

        //初始化促销参数
        function initPromotion(){
            $scope.promotion = {};
            $scope.promotion.promotionPeriods = [];
            $scope.addPromotionError = {};
        };

        function compareTime(startDate, endDate) {
            var start = new Date(startDate);
            var end = new Date(endDate);
            var startTime = start.getTime();
            var endTime = end.getTime();

            if (startTime - endTime > 0)
                return false;
            return true;
        };

        function clone(obj){
            var newO = {};

            if (obj instanceof Array) {
                newO = [];
            }
            for (var key in obj) {
                var val = obj[key];
                newO[key] = typeof val === 'object' ? arguments.callee(val) : val;
            }
            return newO;
        };

        function constructHttpProduct(showProduct){
            var result = {};
            var data = clone(showProduct);
            if(data.productId != undefined && data.productId != null){
                result.productId = data.productId;
            }
            result.description = data.description;
            result.discount = data.discoutsTable;
            result.discountDescription = "暂时写死的";
            result.discountRecord = JSON.stringify(data.discounts);
            result.originPrice = data.originPrice;
            result.productName = data.productName;
            result.interval = 30;
            result.restaurantId = parseInt($.cookie("restaurantId"));
            result.promotionProducts = clone(data.promotions);
            for(var i = 0; i < result.promotionProducts.length; i++){
                for(var j = 0; j < result.promotionProducts[i].promotionPeriods.length; j++){
                    var tempStart = result.promotionProducts[i].promotionPeriods[j].startTime;
                    var tempEnd = result.promotionProducts[i].promotionPeriods[j].endTime;
                    result.promotionProducts[i].promotionPeriods[j].startTime = tempStart.key;
                    result.promotionProducts[i].promotionPeriods[j].endTime = tempEnd.key;
                    result.promotionProducts[i].promotionPeriods[j].price = result.promotionProducts[i].price;
                }
                delete result.promotionProducts[i].price;
            }
            return result;
        };

        function constructShowProduct(httpProduct){
            var result = {};
            var data = clone(httpProduct);
            result.description = data.description;
            result.originPrice = data.originPrice;
            result.productId = data.productId;
            result.productName = data.productName;
            result.discoutsTable = clone(data.discount);
            result.discounts = JSON.parse(data.discountRecord);
            result.promotions = clone(data.promotionProducts);
            for(var i = 0; i < result.promotions.length; i++){
                for(var j = 0; j < result.promotions[i].promotionPeriods.length; j++){
                    var tempStart = result.promotions[i].promotionPeriods[j].startTime;
                    var tempEnd = result.promotions[i].promotionPeriods[j].endTime;
                    var startIndex, endIndex;
                    for(var t = 0; t < $scope.intervals.length; t++){
                        if($scope.intervals[t].key == tempStart){
                            startIndex = t;
                        }
                        if($scope.intervals[t].key == tempEnd){
                            endIndex = t;
                        }
                    }
                    result.promotions[i].promotionPeriods[j].startTime = $scope.intervals[startIndex];
                    result.promotions[i].promotionPeriods[j].endTime = $scope.intervals[endIndex];
                    result.promotions[i].price = result.promotions[i].promotionPeriods[j].price;
                    delete result.promotions[i].promotionPeriods[j].price;
                }
            }
            return result;
        };

        $scope.showMode = 1;
        ProductService.getProduct($.cookie("restaurantId"))
            .success(function(data){
                console.log(data.length);
                for(var i = 0; i < data.length; i++){
                    data[i].discounts = JSON.parse(data[i].discountRecord);
                };
                $scope.rowCollection = data;
            })
            .error(function(){

            });
        initDiscount();
        $scope.newProduct = initNewProduct();
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

            if($scope.showMode == 0){
                $scope.newProduct.discounts.push($scope.discount);
                initDiscount();
            }

            if($scope.showMode == 2){
                $scope.showProduct.discounts.push($scope.discount);
                parseDiscounts($scope.showProduct.discounts, $scope.showProduct.discoutsTable);
                var product = constructHttpProduct($scope.showProduct);
                delete product.promotionProducts;
                console.log(product);
                ProductService.editProduct(product)
                    .success(function(data){
                        initDiscount();
                        console.log(data);
                        alert("添加折扣成功");
                    })
                    .error(function(){
                        $scope.showProduct.discounts.pop();
                        alert("添加折扣失败");
                    })
            }
            ngDialog.close();
        };

        $scope.deleteDiscount = function(temp){
            //新建产品模式
            if($scope.showMode == 0) {
                var index = $scope.newProduct.discounts.indexOf(temp);
                $scope.newProduct.discounts.splice(index, 1);
            }
            //修改产品模式
            if($scope.showMode == 2) {
                var index = $scope.showProduct.discounts.indexOf(temp);
                $scope.showProduct.discounts.splice(index, 1);
                parseDiscounts($scope.showProduct.discounts, $scope.showProduct.discoutsTable);
                var product = constructHttpProduct($scope.showProduct);
                delete product.promotionProducts;
                console.log(product);
                ProductService.editProduct(product)
                    .success(function(data){
                        console.log(data);
                        alert("折扣删除成功");
                    })
                    .error(function(){
                        $scope.showProduct.discounts.splice(index, 0, temp);
                        alert("折扣删除失败");
                    })
            }
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

        $scope.addPromotion = function(){
            initPromotion();
            ngDialog.open({
                templateUrl: 'addNewPromotion.html',
                scope: $scope
            });
        };

        $scope.saveNewPromotion = function(){
            if($scope.promotion.name == undefined || $scope.promotion.name == "" || $scope.promotion.name.length > 15){
                $scope.addPromotionError.flag = true;
                $scope.addPromotionError.info = "请正确填写促销名称";
                return;
            }
            if($scope.promotion.price == undefined || $scope.promotion.price == null || $scope.promotion.price < 0){
                $scope.addPromotionError.flag = true;
                $scope.addPromotionError.info = "请正确填写促销价格";
                return;
            }
            if($scope.promotion.description == undefined || $scope.promotion.description == "" || $scope.promotion.description.length > 30){
                $scope.addPromotionError.flag = true;
                $scope.addPromotionError.info = "请正确填写促销描述";
                return;
            }
            if($scope.promotion.startDate == "" ||
                $scope.promotion.startDate == undefined ||
                $scope.promotion.endDate == "" ||
                $scope.promotion.endDate == undefined ||
                !compareTime($scope.promotion.startDate, $scope.promotion.endDate)){
                $scope.addPromotionError.flag = true;
                $scope.addPromotionError.info = "请正确填写促销起止日期";
                return;
            }
            if($scope.promotion.promotionPeriods.length == 0){
                $scope.addPromotionError.flag = true;
                $scope.addPromotionError.info = "请填写促销时段";
                return;
            }
            for(var i = 0; i < $scope.promotion.promotionPeriods.length; i++){
                if($scope.promotion.promotionPeriods[i].startTime == null ||
                    $scope.promotion.promotionPeriods[i].startTime == undefined ||
                    $scope.promotion.promotionPeriods[i].endTime == null ||
                    $scope.promotion.promotionPeriods[i].endTime == undefined ||
                    $scope.promotion.promotionPeriods[i].startTime.value >= $scope.promotion.promotionPeriods[i].endTime.value) {

                    $scope.addPromotionError.flag = true;
                    $scope.addPromotionError.info = "请正确填写促销时段";
                    return;
                }
            }
            if($scope.showMode == 0){
                $scope.showProduct.promotions.push($scope.promotion);
                ngDialog.close();
            }
            if($scope.showMode == 2){
                var promotion = clone($scope.promotion);
                promotion.productId = $scope.showProduct.productId;
                for(var i = 0; i < promotion.promotionPeriods.length; i++){
                    promotion.promotionPeriods[i].startTime = promotion.promotionPeriods[i].startTime.key;
                    promotion.promotionPeriods[i].endTime = promotion.promotionPeriods[i].endTime.key;
                    promotion.promotionPeriods[i].price = promotion.price;
                }
                promotion.restaurantId = parseInt($.cookie("restaurantId"));
                console.log(promotion);
                ProductService.addPromotion(promotion)
                    .success(function(data){
                        $scope.showProduct.promotions.push($scope.promotion);
                        ngDialog.close();
                        alert("添加促销成功");
                    })
                    .error(function(){
                        $scope.showProduct.promotions.pop();
                        alert("添加促销失败");
                    })
            }
        };

        $scope.deletePromotion = function(promotion){
            var index = $scope.showProduct.promotions.indexOf(promotion);
            if($scope.showMode == 0) {
                $scope.showProduct.promotions.splice(index, 1);
            }
            if($scope.showMode == 2){
                ProductService.deletePromotion(promotion.id)
                    .success(function(data){
                        $scope.showProduct.promotions.splice(index, 1);
                        alert("删除促销成功");
                    })
                    .error(function(){
                        alert("删除促销失败");
                    })
            }
        };


        //新建产品按钮开始
        $scope.submitNewProduct = function() {
            $scope.submitNewProductError = {};
            if($scope.newProduct.productName == undefined ||
                $scope.newProduct.productName == "" ||
                $scope.newProduct.productName.length > 15){

                $scope.submitNewProductError.flag = true;
                $scope.submitNewProductError.info = "请正确填写产品名";
                return;
            }

            if($scope.newProduct.originPrice == undefined ||
                $scope.newProduct.originPrice == null ||
                $scope.newProduct.originPrice < 0){

                $scope.submitNewProductError.flag = true;
                $scope.submitNewProductError.info = "请正确填写产品原价";
                return;
            }

            if($scope.newProduct.description == undefined ||
                $scope.newProduct.description == "" ||
                $scope.newProduct.description.length > 30){

                $scope.submitNewProductError.flag = true;
                $scope.submitNewProductError.info = "请正确填写产品描述";
                return;
            }


            parseDiscounts($scope.newProduct.discounts, $scope.newProduct.discoutsTable);
            //upData.description = $scope.newProduct.description;
            //upData.discount = $scope.newProduct.discoutsTable;
            //upData.discountDescription = "暂时写死的";
            //upData.discountRecord = JSON.stringify($scope.newProduct.discounts);
            //upData.originPrice = $scope.newProduct.originPrice;
            //upData.productName = $scope.newProduct.productName;
            //upData.interval = 30;
            //upData.restaurantId = parseInt($.cookie("restaurantId"));
            //upData.promotionProducts = clone($scope.newProduct.promotions);
            //for(var i = 0; i < upData.promotionProducts.length; i++){
            //    for(var j = 0; j < upData.promotionProducts[i].promotionPeriods.length; j++){
            //        var tempStart = upData.promotionProducts[i].promotionPeriods[j].startTime;
            //        var tempEnd = upData.promotionProducts[i].promotionPeriods[j].endTime;
            //        upData.promotionProducts[i].promotionPeriods[j].startTime = tempStart.key;
            //        upData.promotionProducts[i].promotionPeriods[j].endTime = tempEnd.key;
            //        upData.promotionProducts[i].promotionPeriods[j].price = upData.promotionProducts[i].price;
            //    }
            //    delete upData.promotionProducts[i].price;
            //}
            var upData = constructHttpProduct($scope.newProduct);
            console.log(JSON.stringify(upData));
            ProductService.addProduct(upData)
                .success(function(data){
                    //console.log(data.id);
                    alert("创建产品成功");
                    $scope.newProduct = initNewProduct();
                })
                .error(function(){

                });
        };
        //新建产品按钮结束

        $scope.productList = function(){
            $scope.showMode = 1;
            ProductService.getProduct($.cookie("restaurantId"))
                .success(function(data){
                    console.log(data.length);
                    for(var i = 0; i < data.length; i++){
                        data[i].discounts = JSON.parse(data[i].discountRecord);
                    };
                    $scope.rowCollection = data;
                })
                .error(function(){

                });
        };

        $scope.deleteProduct = function(row){
            var flag = confirm("确认删除产品: " + row.productName + "?");
            if(flag == true) {
                ProductService.deleteProduct(row.productId)
                    .success(function (data) {
                        var index = $scope.rowCollection.indexOf(row);
                        $scope.rowCollection.splice(index, 1);
                    })
                    .error(function () {

                    });
            }
        };

        $scope.modifyProduct = function(row){
            $scope.showMode = 2;
            $scope.showProduct = constructShowProduct(row);
            initDiscount();
        };

        $scope.editProductInfo = function (){
            parseDiscounts($scope.showProduct.discounts, $scope.showProduct.discoutsTable);
            var product = constructHttpProduct($scope.showProduct);
            delete product.promotionProducts;
            console.log(product.productName);
            ProductService.editProduct(product)
                .success(function(data){
                    alert("产品信息修改成功");
                })
                .error(function(){
                    alert("产品信息修改失败");
                })
        };


    }]);