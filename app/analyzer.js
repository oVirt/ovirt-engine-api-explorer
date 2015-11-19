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
 * @file This file contains the functions used to convert JSON objects returned by the server into instances of the
 * model classes, like `Type`, `Service`, etc.
 */

/**
 * Analyzes the given JSON data as returned by the`/ovirt-engine/api/model.json` resource and returns a `Model` object
 * containing the same data.
 *
 * @param {Object} - A JSON object containing the model description.
 * @param {Model} - A `Model` object containg the same data.
 */
function analyzeModel(data) {
    var model = new Model();
    var i, j;

    // Analyze the list of types:
    model.types = [];
    if (data.types) {
        for (i = 0; i < data.types.length; i++) {
            model.types[i] = analyzeType(data.types[i]);
        }
    }

    // Analyze the list of services:
    model.services = [];
    if (data.services) {
        for (i = 0; i < data.services.length; i++) {
            model.services[i] = analyzeService(data.services[i]);
        }
    }

    // Replace attribute type specifications with references to the actual types:
    for (i = 0; i < model.types.length; i++) {
        var attributes = model.types[i].attributes;
        for (j = 0; j < attributes.length; j++) {
            var attribute = attributes[j];
            var spec = attribute.type;
            if (spec && spec.length >= 2 && spec.substring(spec.length - 2) == "[]") {
                spec = spec.substring(0, spec.length - 2);
                var element = Concept.find(model.types, spec);
                if (element) {
                    var type = new ListType();
                    type.element = element;
                    attribute.type = type;
                }
            }
            else {
                var type = Concept.find(model.types, spec);
                if (type) {
                    attribute.type = type;
                }
            }
        }
    }

    // Replace link type specifications with references to the actual types:
    for (i = 0; i < model.types.length; i++) {
        var links = model.types[i].links;
        for (j = 0; j < links.length; j++) {
            var link = links[j];
            var spec = link.type;
            if (spec && spec.length >= 2 && spec.substring(spec.length - 2) == "[]") {
                spec = spec.substring(0, spec.length - 2);
                var element = Concept.find(model.types, spec);
                if (element) {
                    var type = new ListType();
                    type.element = element;
                    link.type = type;
                }
            }
            else {
                var type = Concept.find(model.types, spec);
                if (type) {
                    link.type = type;
                }
            }
        }
    }

    return model;
}

function analyzeType(data) {
    var i;

    var type = new Type();
    analyzeCommon(type, data);

    // Analyze the list of attributes:
    type.attributes = [];
    if (data.attributes) {
        for (i = 0; i < data.attributes.length; i++) {
            type.attributes[i] = analyzeAttribute(data.attributes[i]);
        }
    }

    // Analyze the list of links:
    type.links = [];
    if (data.links) {
        for (i = 0; i < data.links.length; i++) {
            type.links[i] = analyzeLink(data.links[i]);
        }
    }

    return type;
}

function analyzeAttribute(data) {
    var attribute = new Attribute();
    analyzeCommon(attribute, data);

    // Save the type specification, which will be later replaced by the reference to the corresponding type object:
    if (data.type) {
        attribute.type = data.type;
    }

    return attribute;
}

function analyzeLink(data) {
    var link = new Link();
    analyzeCommon(link, data);

    // Save the type specification, which will be later replaced by the reference to the corresponding type object:
    if (data.type) {
        link.type = data.type;
    }

    return link;
}

function analyzeService(data) {
    var i;

    var service = new Service();
    analyzeCommon(service, data);

    // Analyze the list of methods:
    service.methods = [];
    if (data.methods) {
        for (i = 0; i < data.methods.length; i++) {
            service.methods[i] = analyzeMethod(data.methods[i]);
        }
    }

    // Analyze the list of locators:
    service.locators = [];
    if (data.locators) {
        for (i = 0; i < data.locators.length; i++) {
            service.locators[i] = analyzeLocator(data.locators[i]);
        }
    }

    return service;
}

function analyzeMethod(data) {
    var method = new Method();
    analyzeCommon(method, data);
    return method;
}

function analyzeLocator(data) {
    var locator = new Locator();
    analyzeCommon(locator, data);
    return locator;
}

function analyzeCommon(concept, data) {
    analyzeName(concept, data);
    analyzeDoc(concept, data);
}

function analyzeName(concept, data) {
    if (data.name) {
        concept.id = data.name;
        concept.name = "";
        var words = data.name.split("-");
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word.length > 0) {
                word = word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
            }
            concept.name += word;
        }
    }
}

function analyzeDoc(concept, data) {
    if (data.doc) {
        concept.doc = marked(data.doc);
        var i = concept.doc.indexOf(".");
        if (i != -1) {
            concept.summary = concept.doc.substring(0, i + 1);
        }
        else {
            concept.summary = concept.doc;
        }
    }
    else {
        concept.summary = "";
        concept.doc = "";
    }
}
