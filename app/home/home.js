"use strict";

var home = angular.module("ovApiDoc.home", ["ngRoute"])

home.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/home", {
    templateUrl: "home/home.html",
    controller: 'HomeCtrl'
  });
}]);

home.controller("HomeCtrl", ["$scope", function($scope) {
}]);
