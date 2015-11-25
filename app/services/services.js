/*
Copyright (c) 2015 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * @file This file contains the module that handles model services.
 */

"use strict";

var services = angular.module("ovApiDoc.services", ["ngRoute"])

// Populates the "services" property with an array containg all the services
// of the model:
services.controller("ServicesCtrl", ["$scope", "model", function($scope, model) {
    $scope.services = model.services;
}]);

// Populates the scope with the service corresponding to the given parameters:
services.controller("ServiceCtrl", [
    "$scope",
    "$routeParams",
    "model",
    function($scope, $routeParams, model) {
        var serviceId = $routeParams.serviceId;
        var service = Concept.find(model.services, serviceId);
        $scope.service = service;
        $scope.methods = service.methods;
        $scope.locators = service.locators;
    }
]);

// Populates the scope with the method corresponding to the given parameters:
services.controller("MethodCtrl", [
    "$scope",
    "$routeParams",
    "model",
    function($scope, $routeParams, model) {
        var serviceId = $routeParams.serviceId;
        var methodId = $routeParams.methodId;
        var service = Concept.find(model.services, serviceId);
        var method = Concept.find(service.methods, methodId);
        $scope.service = service;
        $scope.method = method;
        $scope.parameters = method.parameters;
    }
]);

// Configure the routes for the list of services and for the details of
// a service or method:
services.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/services/:serviceId/methods/:methodId", {
        templateUrl: "services/method.html",
        controller: "MethodCtrl"
    });
    $routeProvider.when("/services/:serviceId", {
        templateUrl: "services/service.html",
        controller: "ServiceCtrl"
    });
    $routeProvider.when("/services", {
        templateUrl: "services/services.html",
        controller: "ServicesCtrl"
    });
}])
