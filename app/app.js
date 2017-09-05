'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'myApp.version',
        'myApp.management',
        'myApp.reservation',
        'myApp.chart',
        'myApp.basicInfo',
        'myApp.productManagement',
        'myApp.menuManagement',
        'myApp.activityManagement',
        'myApp.voucherManagement'
    ])

    //.constant('BaseUrl', 'https://api.bestfood.cc/')
    //.constant('userPort', 'api/operation')
    //.constant('merchantPort', 'api/merchant')
    //.constant('managementPort', 'api/operation')
    //.constant('restaurantPort', 'api/merchant')


    //.constant('BaseUrl', 'http://115.159.87.129:')
    //.constant('userPort', '8008')
    //.constant('merchantPort', '8004')
    //.constant('managementPort', '8008')
    //.constant('restaurantPort', '8004')

    .constant('BaseUrl', 'http://123.206.181.47:')
    .constant('userPort', '8001')
    .constant('merchantPort', '8004')
    .constant('managementPort', '8008')
    .constant('restaurantPort', '8000')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/management'});
    }]);

