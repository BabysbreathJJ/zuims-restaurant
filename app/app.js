'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'myApp.version',
    'myApp.management',
    'myApp.reservation'
]).
config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/reservation');
}]);
