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
 * @file This file contains the module that handles services.
 */

"use strict";

var types = angular.module("ovApiDoc.types", ["ngRoute"])

// Populates the "types" property with an array containing all the types of the model:
types.controller("TypesCtrl", [
    "$scope", 
    "model",
    function($scope, model) {
        $scope.types = model.types;
    }
]);

// Populates the scope with the type corresponding to the given parameter:
types.controller("TypeCtrl", [
    "$scope",
    "$routeParams",
    "model",
    function($scope, $routeParams, model) {
        // Find the type:
        var typeId = $routeParams.typeId;
        var type = Concept.find(model.types, typeId);
        $scope.type = type;

        // The details of the type and the template used to render it depend on the kind of type, so we need to check
        // it and act accordingly:
        if (type instanceof PrimitiveType) {
            $scope.template = "primitive";
        }
        else if (type instanceof EnumType) {
            $scope.values = type.values;
            $scope.template = "enum";
        }
        else {
            $scope.attributes = type.attributes;
            $scope.links = type.links;
            $scope.template = "struct";
        }
    }
]);

// Configures the routes for the list of types and for the details of a specific service:
types.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/types", {
        templateUrl: "types/types.html",
        controller: "TypesCtrl"
    });
    $routeProvider.when("/types/:typeId", {
        templateUrl: "types/type.html",
        controller: "TypeCtrl"
    });
}])
