angular.module('myApp.voucherManagement', ['ngDialog', 'moment-picker', 'ngImgCrop', 'angular-sortable-view'])
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

    .factory('VoucherService', ['$http', 'BaseUrl', 'merchantPort', 'managementPort', function ($http, BaseUrl, merchantPort, managementPort) {
        var factory = {};

        factory.getMyVoucher = function(restaurantId) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/voucher/get?resId=" + restaurantId ,
                crossDomain: true
            });
        };

        factory.editVoucher = function(voucherInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/voucher/edit',
                data: JSON.stringify(voucherInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };


        factory.deleteVoucher = function(voucherId) {
            return $http({
                method: "GET",
                url: BaseUrl + merchantPort + "/voucher/delete?voucherId=" + voucherId,
                crossDomain: true
            });

        };

        factory.addVoucher = function(voucherInfo) {
            return $http({
                method: "POST",
                url: BaseUrl + merchantPort + '/voucher/add',
                data: JSON.stringify(voucherInfo),
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

        factory.getOrder = function (restaurantId) {
            return $http({
                method:"GET",
                url:BaseUrl+merchantPort+"/voucher/getVoucherOrderByResId?resId=" +restaurantId,
                crossdomain:true
            });
        };

        return factory;
    }])












    .controller('VoucherCtrl',['$scope','ngDialog','VoucherService',function ($scope,ngDialog,VoucherService) {

        //初始化显示数据
        $scope.myVoucherCollection=[];
        $scope.usedVoucherCollection=[];
        $scope.productCollection=[];
        $scope.orderVoucherCollection=[];
        $scope.dateCollection=[];
        $scope.newDateCollection=[];
        $scope.showMode=0;

        //获取后台数据
        function getMyVoucher(){
            //获取所有电子券
            VoucherService.getMyVoucher($.cookie("restaurantId"))
                .success(function (allVoucher) {
                    console.log(allVoucher);
                    $scope.myVoucherCollection = allVoucher;
                    var temp=[];
                    //获取结束电子券
                    var now = new Date();
                    for(var i=0;i<allVoucher.length;i++){
                       var str = allVoucher[i].endDate;
                       var time = new Date(str);
                        var date = now.getTime() - time.getTime();
                        if(date>0){
                            temp.push(allVoucher[i]);
                        }
                    }
                    $scope.usedVoucherCollection=temp;
                });

        }



        function getOrder(){
            VoucherService.getOrder($.cookie("restaurantId"))
                .success(function (order) {
                    console.log(order);
                    $scope.orderVoucherCollection=order;
                });
        }



        function getProduct(){
            VoucherService.getProduct($.cookie("restaurantId"))
                .success(function (product) {
                    console.log(product);
                    $scope.productCollection=product;
                });
        }

        getMyVoucher();
        getProduct();
        getOrder();



        //页面转换
        $scope.myVoucher = function(){
            $scope.showMode=0;
        };

        $scope.endVoucher =function () {
            $scope.showMode=1;
        };
        $scope.orderVoucher=function(){
            $scope.showMode=3;
        };



        //修改电子券
        $scope.editVoucher = function (row) {
            $scope.voucherToHandle = {
                "content":row.content,
                "description":row.description,
                "endDate":row.endDate,
                "hotelName":row.hotelName,
                "id":row.id,
                "leftQuantity":row.leftQuantity,
                "maxNumPerUser":row.maxNumPerUser,
                "productId":row.productId,
                "quantity":row.quantity,
                "resId":row.resId,
                "startDate":row.startDate,
                "voucherId":row.voucherId
            };
            $scope.newDateCollection={
                "startYear":"",
                "startMonth":"",
                "startDay":"",
                "endYear":"",
                "endMonth":"",
                "endDay":""
            }


            $scope.showMode=4;
        }

        //更新电子券
        $scope.updateVoucher = function () {
            //防止输入为空
            $scope.updateVoucherError={};
            if($scope.voucherToHandle.content==undefined ||
                $scope.voucherToHandle.content=="" ){
                $scope.updateVoucherError.flag =true;
                $scope.updateVoucherError.info="请填写电子券名称";
                return;
            }

            if($scope.voucherToHandle.quantity==undefined ||
                $scope.voucherToHandle.quantity == "" ||
                $scope.voucherToHandle.quantity<0){
                $scope.updateVoucherError.flag=true;
                $scope.updateVoucherError.info="请填写电子券数量";
                return;
            }

            if($scope.voucherToHandle.description==undefined ||
                $scope.voucherToHandle.description=="" ){
                $scope.updateVoucherError.flag=true;
                $scope.updateVoucherError.info="请填写活动详情";
                return;
            }

            if($scope.voucherToHandle.maxNumPerUser==undefined ||
                $scope.voucherToHandle.maxNumPerUser ==""||
                $scope.voucherToHandle.maxNumPerUser<0){
                $scope.updateVoucherError.flag=true;
                $scope.updateVoucherError.info="请填写领取限制";
                return;
            }
            if($scope.newDateCollection.startYear==""||$scope.newDateCollection.startMonth==""||$scope.newDateCollection.startDay==""){
                $scope.updateVoucherError.flag=true;
                $scope.updateVoucherError.info="请选择新的开始日期";
                return;
            }
            if($scope.newDateCollection.endYear==""||$scope.newDateCollection.endMonth==""||$scope.newDateCollection.endDay==""){
                $scope.updateVoucherError.flag=true;
                $scope.updateVoucherError.info="请选择新的结束日期";
                return;
            }

            if($scope.voucherToHandle.productId==""){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请选择绑定套餐";
                return;
            }
            if(+$scope.newDateCollection.startYear>+$scope.newDateCollection.endYear){
                $scope.updateVoucherError.flag=true;
                $scope.updateVoucherError.info="请确定结束日期是否合理";
                return;
            }
            if(($scope.newDateCollection.startYear==$scope.newDateCollection.endYear)&&(+$scope.newDateCollection.startMonth>+$scope.newDateCollection.endMonth)){
                $scope.updateVoucherError.flag=true;
                $scope.updateVoucherError.info="请确定结束日期是否合理";
                return;
            }
            if(($scope.newDateCollection.startYear==$scope.newDateCollection.endYear) &&($scope.newDateCollection.startMonth==$scope.newDateCollection.endMonth)
                &&(+$scope.newDateCollection.startDay>=+$scope.newDateCollection.endDay)){
                $scope.updateVoucherError.flag=true;
                $scope.updateVoucherError.info="请确定结束日期是否合理";
                return;
            }
            //结束




            //日期规范化
           if(+$scope.newDateCollection["startMonth"]>0 && +$scope.newDateCollection["startMonth"]<10){
               $scope.newDateCollection["startMonth"]="0"+$scope.newDateCollection["startMonth"];
           }
            if(+$scope.newDateCollection["startDay"]>0 && +$scope.newDateCollection["startDay"]<10){
                $scope.newDateCollection["startDay"]="0"+$scope.newDateCollection["startDay"];
            }
            if(+$scope.newDateCollection["endMonth"]>0 && +$scope.newDateCollection["endMonth"]<10){
                $scope.newDateCollection["endMonth"]="0"+$scope.newDateCollection["endMonth"];
            }
            if(+$scope.newDateCollection["endDay"]>0 && +$scope.newDateCollection["endDay"]<10){
                $scope.newDateCollection["endDay"]="0"+$scope.newDateCollection["endDay"];
            }
            $scope.voucherToHandle["startDate"]=$scope.newDateCollection["startYear"]+"-"+$scope.newDateCollection["startMonth"]
            +"-"+$scope.newDateCollection["startDay"]+" 00:00:00";
            $scope.voucherToHandle["endDate"]=$scope.newDateCollection["endYear"]+"-"+$scope.newDateCollection["endMonth"]
            +"-"+$scope.newDateCollection["endDay"]+" 00:00:00";
            VoucherService.editVoucher($scope.voucherToHandle)
                .success(function (data) {
                    alert("修改成功");
                    getMyVoucher();
                    ngDialog.close();
                    $scope.showMode=0;
                })
        }

        //新增电子券
        $scope.addVoucher =function () {
            $scope.dateCollection={
                "startYear":"",
                "startMonth":"",
                "startDay":"",
                "endYear":"",
                "endMonth":"",
                "endDay":""
            }
            $scope.voucherToHandle = {
                "content":"",
                "quantity":"",
                "description":"",
                "maxNumPerUser":"",
                "startDate":"",
                "endDate":"",
                "productId":""
            };
            $scope.showMode=2;
        }



        //提交电子券
        $scope.submitVoucher = function () {

            //防止输入为空
            $scope.submitVoucherError={};
            if($scope.voucherToHandle.content==undefined ||
            $scope.voucherToHandle.content=="" ){
                $scope.submitVoucherError.flag =true;
                $scope.submitVoucherError.info="请正确填写电子券名称";
                return;
            }

            if($scope.voucherToHandle.quantity==undefined ||
            $scope.voucherToHandle.quantity == "" ||
            $scope.voucherToHandle.quantity<0){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请正确填写电子券数量";
                return;
            }

            if($scope.voucherToHandle.description==undefined ||
            $scope.voucherToHandle.description=="" ){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请填写活动详情";
                return;
            }

            if($scope.voucherToHandle.maxNumPerUser==undefined ||
            $scope.voucherToHandle.maxNumPerUser ==""||
            $scope.voucherToHandle.maxNumPerUser<0){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请正确填写领取限制";
                return;
            }
            if($scope.voucherToHandle.maxNumPerUser==undefined ||
                $scope.voucherToHandle.maxNumPerUser ==""||
                $scope.voucherToHandle.maxNumPerUser<0){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请正确填写领取限制";
                return;
            }
            if($scope.voucherToHandle.maxNumPerUser==undefined ||
                $scope.voucherToHandle.maxNumPerUser ==""||
                $scope.voucherToHandle.maxNumPerUser<0){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请正确填写领取限制";
                return;
            }
            if($scope.voucherToHandle.maxNumPerUser==undefined ||
                $scope.voucherToHandle.maxNumPerUser ==""||
                $scope.voucherToHandle.maxNumPerUser<0){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请正确填写领取限制";
                return;
            }
            if($scope.dateCollection.startYear==""||$scope.dateCollection.startMonth==""||$scope.dateCollection.startDay==""){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请选择开始日期";
                return;
            }
            if($scope.dateCollection.endYear==""||$scope.dateCollection.endMonth==""||$scope.dateCollection.endDay==""){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请选择结束日期";
                return;
            }
            if($scope.voucherToHandle.productId==""){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请选择绑定套餐";
                return;
            }
            if(+$scope.dateCollection.startYear>+$scope.dateCollection.endYear){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请确定结束日期是否合理";
                return;
            }
            if(($scope.dateCollection.startYear==$scope.dateCollection.endYear)&&(+$scope.dateCollection.startMonth>+$scope.dateCollection.endMonth)){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请确定结束日期是否合理";
                return;
            }
            if(($scope.dateCollection.startYear==$scope.dateCollection.endYear) &&($scope.dateCollection.startMonth==$scope.dateCollection.endMonth)
                &&(+$scope.dateCollection.startDay>=+$scope.dateCollection.endDay)){
                $scope.submitVoucherError.flag=true;
                $scope.submitVoucherError.info="请确定结束日期是否合理";
                return;
            }
            //结束



            //规范日期格式
            if(+$scope.dateCollection["startMonth"]>0 && +$scope.dateCollection["startMonth"]<10){
                $scope.dateCollection["startMonth"]="0"+$scope.dateCollection["startMonth"];
            }
            if(+$scope.dateCollection["startDay"]>0 && +$scope.dateCollection["startDay"]<10){
                $scope.dateCollection["startDay"]="0"+$scope.dateCollection["startDay"];
            }
            if(+$scope.dateCollection["endMonth"]>0 && +$scope.dateCollection["endMonth"]<10){
                $scope.dateCollection["endMonth"]="0"+$scope.dateCollection["endMonth"];
            }
            if(+$scope.dateCollection["endDay"]>0 && +$scope.dateCollection["endDay"]<10){
                $scope.dateCollection["endDay"]="0"+$scope.dateCollection["endDay"];
            }
            $scope.voucherToHandle["startDate"]=$scope.dateCollection["startYear"]+"-"+$scope.dateCollection["startMonth"]+
                "-"+$scope.dateCollection["startDay"];
            $scope.voucherToHandle["startDate"]=  $scope.voucherToHandle["startDate"]+" 00:00:00";
            $scope.voucherToHandle["endDate"]=$scope.dateCollection["endYear"]+"-"+$scope.dateCollection["endMonth"]+
                "-"+$scope.dateCollection["endDay"];
            $scope.voucherToHandle["endDate"]=  $scope.voucherToHandle["endDate"]+" 00:00:00";
            //规范化完成

                VoucherService.addVoucher($scope.voucherToHandle)
                    .success(function (data) {
                        alert("提交成功");
                        getMyVoucher();
                        ngDialog.close();
                        $scope.showMode=0
                    });
        }


        //删除电子券
        $scope.deleteVoucher = function (row) {
            VoucherService.deleteVoucher(row.voucherId)
                .success(function (data) {
                    alert("删除成功!");
                    getMyVoucher();
                })
        }









    }]);