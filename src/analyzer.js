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

import * as concepts from 'concepts'

/**
 * Analyzes the given JSON data as returned by the`/ovirt-engine/api/model.json` resource and returns a `Model` object
 * containing the same data.
 *
 * @param {Object} - A JSON object containing the model description.
 * @param {Model} - A `Model` object containg the same data.
 */
export function analyzeModel(data) {
    var model = new concepts.Model();
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

    // Replace attribute and link type specifications with references to the actual types:
    for (i = 0; i < model.types.length; i++) {
        var type = model.types[i];
        if (type instanceof concepts.StructType) {
            resolveTypes(type.attributes, model.types);
            resolveTypes(type.links, model.types);
        }
    }

    // Replace method parameter type specifications with references to the actual types:
    for (i = 0; i < model.services.length; i++) {
        var service = model.services[i];
        for (j = 0; j < service.methods.length; j++) {
            var method = service.methods[j];
            resolveTypes(method.parameters, model.types);
        }
    }

    return model;
}

function analyzeType(data) {
    var type;
    if (data.kind == "primitive") {
        type = analyzePrimitiveType(data);
    }
    else if (data.kind == "enum") {
        type = analyzeEnumType(data);
    }
    else {
        type = analyzeStructType(data);
    }
    return type;
}

function analyzePrimitiveType(data) {
    var type = new concepts.PrimitiveType();
    analyzeCommon(type, data);
    return type;
}

function analyzeEnumType(data) {
    var i;
    var type = new concepts.EnumType();
    analyzeCommon(type, data);

    // Analyze the list of values:
    type.values = [];
    if (data.values) {
        for (i = 0; i < data.values.length; i++) {
            type.values[i] = analyzeEnumValue(data.values[i]);
        }
    }

    return type;
}

function analyzeEnumValue(data) {
    var value = new concepts.EnumValue();
    analyzeCommon(value, data);
    return value;
}

function analyzeStructType(data) {
    var i;
    var type = new concepts.StructType();
    analyzeCommon(type, data);

    // Analyze the list of attributes:
    type.attributes = [];
    if (data.attributes) {
        for (var i = 0; i < data.attributes.length; i++) {
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
    var attribute = new concepts.Attribute();
    analyzeCommon(attribute, data);

    // Save the type specification, which will be later replaced by the reference to the corresponding type object:
    if (data.type) {
        attribute.type = data.type;
    }

    return attribute;
}

function analyzeLink(data) {
    var link = new concepts.Link();
    analyzeCommon(link, data);

    // Save the type specification, which will be later replaced by the reference to the corresponding type object:
    if (data.type) {
        link.type = data.type;
    }

    return link;
}

function analyzeService(data) {
    var i;
    var service = new concepts.Service();
    analyzeCommon(service, data);

    // Analyze the list of methods:
    service.methods = [];
    if (data.methods) {
        for (i = 0; i < data.methods.length; i++) {
            service.methods[i] = analyzeMethod(data.methods[i]);
            service.methods[i].service = service;
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
    var i;
    var method = new concepts.Method();
    analyzeCommon(method, data);

    // Analyze the list of parameters:
    method.parameters = [];
    if (data.parameters) {
        for (i = 0; i < data.parameters.length; i++) {
            method.parameters[i] = analyzeParameter(data.parameters[i]);
            method.parameters[i].method = method;
        }
    }

    return method;
}

function analyzeParameter(data) {
    var parameter = new concepts.Parameter();
    analyzeCommon(parameter, data);

    // Copy the direction flags:
    parameter.in = data.in;
    parameter.out = data.out;

    // Save the type specification, which will be later replaced by the reference to the corresponding type object:
    if (data.type) {
        parameter.type = data.type;
    }

    return parameter;
}

function analyzeLocator(data) {
    var locator = new concepts.Locator();
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
        concept.doc = data.doc;
        concept.html = data.html;
        var i = concept.html.indexOf(".");
        if (i != -1) {
            concept.summary = concept.html.substring(0, i + 1);
        }
        else {
            concept.summary = concept.html;
        }
    }
    else {
        concept.summary = "";
        concept.doc = "";
        concept.html = "";
    }
}

/**
 * Iterates an array of concepts, looking for references to types (attributes named `type`) and replaces those that
 * are strings with the reference to the type object.
 *
 * @param {Concept[]} concepts - An array of concepts, that may have references to types.
 * @param {Type[]} types - An array containing all the valid types.
 */
function resolveTypes(concepts, types) {
    for (var i = 0; i < concepts.length; i++) {
        resolveType(concepts[i], types);
    }
}

/**
 * Replaces type specifications with references to the type objects.
 *
 * @param {Concept} object - The object that may contain `type` attributes referencing types.
 * @param {Type[]} types - An array containing the valid types.
 */
function resolveType(concept, types) {
    var spec = concept.type;
    var type;
    var element;
    if (spec) {
        if (spec.length >= 2 && spec.substring(spec.length - 2) == "[]") {
            spec = spec.substring(0, spec.length - 2);
            element = concepts.Concept.find(types, spec);
            type = new concepts.ListType();
            type.element = element;
        }
        else {
            type = concepts.Concept.find(types, spec);
        }
        concept.type = type;
    }
}
