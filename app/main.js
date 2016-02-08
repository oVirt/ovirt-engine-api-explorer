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
 * @file This file contains the main module of the application.
 */

"use strict";

// Declare application level module and make it depends on views
// and components:
var app = angular.module("ovApiDoc", [
  "ngRoute",
  "ngSanitize",
  "ovApiDoc.home",
  "ovApiDoc.types",
  "ovApiDoc.services",
]);

// Configure the router so that it redirects to the home
// view by default:
app.config([
    "$routeProvider", function($routeProvider) {
        $routeProvider.otherwise({redirectTo: "/home"});
    }
]);

// A singleton to store the loaded model:
app.factory("model", [function() {
    // Download the model from the server:
    var request = new XMLHttpRequest();
    var model;
    request.open("GET", "model.json", false);
    request.send(null);
    if (request.status == 200) {
        var data = angular.fromJson(request.response);
        model = analyzeModel(data);
    }

    // Return the model:
    return model;
}]);

// Renders a link to a model concept:
app.directive("ovLink", function() {
    return {
        scope: {
            concept: "=",
        },
        controller: function($scope) {
            var concept = $scope.concept;
            var text = concept.name;
            var href;
            if (concept instanceof Type) {
                if (concept instanceof ListType) {
                    var item = concept.element;
                    href = "#/types/" + item.id;
                    text = item.name;
                }
                else {
                    href = "#/types/" + concept.id;
                }
            }
            else if (concept instanceof Service) {
                href = "#/services/" + concept.id;
            }
            else if (concept instanceof Method) {
                href =
                    "#/services/" + concept.service.id +
                    "/methods/" + concept.id;
            }
            else if (concept instanceof Parameter) {
                href =
                    "#/services/" + concept.method.service.id +
                    "/methods/" + concept.method.id +
                    "/parameters/" + concept.id;
            }
            else if (concept) {
                text = concept.toString();
            }
            else {
                text = "?";
            }
            $scope.href = href;
            $scope.text = text;
        },
        templateUrl: "directives/link.html",
    };
});	

// Renders the summary of a model concept:
app.directive("ovSummary", function() {
    return {
        scope: {
            concept: "=",
        },
        templateUrl: "directives/summary.html",
    };
});

// Renders the description of a model concept:
app.directive("ovDoc", function() {
    return {
        restrict: "E",
        scope: {
            concept: "=",
        },
        link: function($scope, element) {
            element.html($scope.concept.html);
            $('pre.highlightjs').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        },
    };
});

// Renders the direction of a parameter:
app.directive("ovDirection", function() {
    return {
        scope: {
            concept: "=",
        },
        templateUrl: "directives/direction.html",
    };
});
