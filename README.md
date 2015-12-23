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
