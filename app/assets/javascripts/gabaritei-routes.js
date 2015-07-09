// This file will keep all the routes for our application
// for each controller we'll have one app module
// to keep things organized
var homeRoutes = angular.module('homeRoutes', ['ngRoute', 'homeControllers', 'subjectControllers']);

/**
* Routing for 'Home'
*/
homeRoutes.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'assets/partials/home/home.html',
        controller: 'homeController'
      }).otherwise({
        redirectTo: '/home'
      });
  }]);


/**
* Routing for 'Subjects'
*/
var subjectsRoutes = angular.module('subjectsRoutes', ['ngRoute']);

homeRoutes.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/subjects', { 
        templateUrl: 'assets/partials/subjects/index.html',
        controller: 'subjectController'
      });
  }]);