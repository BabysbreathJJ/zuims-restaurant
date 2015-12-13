'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'myApp.version',
    'myApp.management'
]).
config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/management');
}]);
