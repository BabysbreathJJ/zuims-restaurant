'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.version',
    'myApp.management',
    'myApp.reservation',
    'myApp.chart',
    'myApp.basicInfo'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/management'});
}]);