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

// Populates the scope with the service corresponding to the given parameter:
services.controller("ServiceCtrl", [
    "$scope",
    "$routeParams",
    "model",
    function($scope, $routeParams, model) {
        var id = $routeParams.id;
        var service = Concept.find(model.services, id);
        $scope.service = service;
        $scope.methods = service.methods;
        $scope.locators = service.locators;
    }
]);

// Configure the routes for the list of services and for the details of
// a specific service:
services.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/services", {
        templateUrl: "services/services.html",
        controller: "ServicesCtrl"
    });
    $routeProvider.when("/services/:id", {
        templateUrl: "services/service.html",
        controller: "ServiceCtrl"
    });
}])
