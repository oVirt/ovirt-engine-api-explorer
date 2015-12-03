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

// Configure the Markdown processor so that it uses Highlihght.js for
// code highlighting:
marked.setOptions({
  highlight: function(code, lang) {
    var result;
    if (lang) {
        result = hljs.highlight(lang, code).value;
    }
    else {
        result = code;
    }
    return result;
  }
});

// Declare application level module and make it depends on views
// and components:
var app = angular.module("ovApiDoc", [
  "ngRoute",
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
        link: function(scope, element, attr) {
            var concept = scope.concept;
            var html;
            if (concept instanceof Type) {
                if (concept instanceof ListType) {
                    var item = concept.element;
                    html = "<a href='#/types/" + item.id + "'>" + item.name + "</a>[]";
                }
                else {
                    html = "<a href='#/types/" + concept.id + "'>" + concept.name + "</a>";
                }
            }
            else if (concept instanceof Service) {
                html = "<a href='#/services/" + concept.id + "'>" + concept.name + "</a>";
            }
            else if (concept instanceof Method) {
                html =
                    "<a href='#" +
                    "/services/" + concept.service.id +
                    "/methods/" + concept.id +
                    "'>" + concept.name + "</a>";
            }
            else if (concept instanceof Parameter) {
                html =
                    "<a href='#" +
                    "/services/" + concept.method.service.id + 
                    "/methods/" + concept.method.id + 
                    "/parameters/" + concept.id + 
                    "'>" + concept.name + "</a>";
            }
            else if (concept) {
                html = concept.toString();
            }
            else {
                html = "?";
            }
            element.html(html);
        },
    };
});	

// Renders the summary of a model concept:
app.directive("ovSummary", function() {
    return {
        scope: {
            concept: "=",
        },
        link: function(scope, element, attr) {
            var concept = scope.concept;
            element.html(concept.summary);
        },
    };
});

// Renders the documentation of a model concept:
app.directive("ovDoc", function() {
    return {
        scope: {
            concept: "=",
        },
        link: function(scope, element, attr) {
            var concept = scope.concept;
            element.html(concept.doc);
        },
    };
});

// Renders the direction of a parameter:
app.directive("ovDirection", function() {
    return {
        scope: {
            concept: "=",
        },
        link: function(scope, element, attr) {
            var concept = scope.concept;
            var html;
            if (concept.in && concept.out) {
                html = "In/Out";
            }
            else if (concept.in) {
                html = "In";
            }
            else if (concept.out) {
                html = "Out";
            }
            else {
                html = "?";
            }
            element.html(html);
        },
    };
});
