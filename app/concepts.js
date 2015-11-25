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
 * @file This file contains a set of classes useful for working with model concepts. At the moment they aren't very
 * sophisticated, as all the work is performed using attributes directly, but at least they help when needing to
 * check what is the type of a concept, using the `instanceof` operator.
 */

/**
 * A class that represents a model concept.
 *
 * @class
 */
function Concept() {
}

/**
 * Compares two concepts by name, to be used with the "sort" function.
 *
 * @param {Concept} left - The first concept to compare.
 * @param {Concept} right - The second concept to compare.
 */
Concept.compare = function(left, right) {
    left = left.id;
    right = right.id;
    if (left < right) {
        return -1;
    }
    if (left > right) {
        return 1;
    }
    return 0;
};

/**
 * Find the concept with the given id in the given array.
 *
 * @param {Concept[]} array - The array of concepts.
 * @param {String} id - The id to look for.
 * @returns {Concept} The concept with the given id, or `null` if no such concept exists.
 */
Concept.find = function(array, id) {
    if (id === null) {
        return null;
    }
    for (var i = 0; i < array.length; i++) {
        var concept = array[i];
        if (id == concept.id) {
            return concept;
        }
    }
    return null;
};

/**
 * A class that represents a model type.
 *
 * @class
 */
function Type() {
    Concept.call(this);
}

Type.prototype = new Concept();

/**
 * A class that represents a built-in primitive type, like `string` or `boolean`.
 *
 * @class
 */
function PrimitiveType() {
    Type.call(this);
}

PrimitiveType.prototype = new Type();

/**
 * A class that represents an structured type, basically a collection of attributes.
 *
 * @class
 */
function StructType() {
    Type.call(this);
}

StructType.prototype = new Type();

/**
 * A class that represents a list type.
 *
 * @class
 */
function ListType() {
    Type.call(this);
}

ListType.prototype = new Type();

/**
 * A class that represents a model service.
 *
 * @class
 */
function Service() {
    Concept.call(this);
}

Service.prototype = new Concept();

/**
 * A class that represents an attribute of an structured type.
 *
 * @class
 */
function Attribute() {
    Concept.call(this);
}

Attribute.prototype = new Concept();

/**
 * A class that represents a link of an structured type.
 *
 * @class
 */
function Link() {
    Concept.call(this);
}

Link.prototype = new Concept();

/**
 * A class that represents a method of a service.
 *
 * @class
 */
function Method() {
    Concept.call(this);
}

Method.prototype = new Concept();

/**
 * A class that represents a method parameter.
 *
 * @class
 */
function Parameter() {
    Concept.call(this);
}

Parameter.prototype = new Concept();

/**
 * A class that represents a service locator.
 *
 * @class
 */
function Locator() {
    Concept.call(this);
}

Locator.prototype = new Concept();

/**
 * A class that represents a model.
 *
 * @class
 */
function Model() {
}
