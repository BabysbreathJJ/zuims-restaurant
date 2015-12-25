# zuims-restaurant
最美食商户管理前端代码
- - -
###Angular Chart
让tooltip一直显示，使用options来完成一系列的配置，其中调用showTootip方法所传的参数不一样。

Type        |   Method
----   |   ----
chart-line  |  ·this.showTooltip(this.datasets[0].points,true);·
chart-bar  |  ·this.showTooltip(this.datasets[0].bars, true);·
chart-pie  |  ·this.showTooltip(this.segments, true);·

- - -

定制tooltip内容,单独写一个函数拿到chart上没有的数据
<code>

    $scope.options = {
            tooltipEvents: [],
            showTooltips: true,
            tooltipCaretSize: 0,
            onAnimationComplete: function () {
                console.log(this.datasets[0]);
                this.showTooltip(this.datasets[0].points, true);
            }
        };
        
    Chart.defaults.global.tooltipTemplate = function (label) {
            return "￥" + getTotalSales(label.value);
        };
        
</code>