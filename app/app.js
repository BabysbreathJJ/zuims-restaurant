'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'myApp.version',
        'myApp.management',
        'myApp.reservation',
        'myApp.chart',
        'myApp.basicInfo'
    ])
    //.constant('BaseUrl', 'http://api.zui.ms/')
    //.constant('userPort', 'api/operation')
    //.constant('merchantPort', 'api/merchant')
    //.constant('managementPort', 'api/operation')
    //.constant('restaurantPort', 'api/merchant')

    //.constant('BaseUrl', 'http://115.159.87.129:')
    //.constant('userPort', '8008')
    //.constant('merchantPort', '8004')
    //.constant('managementPort', '8008')
    //.constant('restaurantPort', '8004')

    .constant('BaseUrl', 'http://202.120.40.175:')
    .constant('userPort', '8001')
    .constant('merchantPort', '21104')
    .constant('managementPort', '21108')
    .constant('restaurantPort', '21100')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/management'});
    }]);

