/*
Copyright (c) 2015-2016 Red Hat, Inc.

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
 */
export class Concept {
  /**
   * Compares two concepts by name, to be used with the "sort" function.
   *
   * @param {Concept} left - The first concept to compare.
   * @param {Concept} right - The second concept to compare.
   */
  static compare (left, right) {
    left = left.id
    right = right.id
    if (left < right) {
      return -1
    }
    if (left > right) {
      return 1
    }
    return 0
  }

  /**
   * Find the concept with the given id in the given array.
   *
   * @param {Concept[]} array - The array of concepts.
   * @param {String} id - The id to look for.
   * @returns {Concept} The concept with the given id, or `null` if no such concept exists.
   */
  static find (array, id) {
    if (id === null) {
      return null
    }
    for (var i = 0; i < array.length; i++) {
      var concept = array[i]
      if (id == concept.id) {
          return concept
      }
    }
    return null
  }
}

/**
 * A class that represents a model type.
 */
export class Type extends Concept {
}

/**
 * A class that represents a built-in primitive type, like `string` or `boolean`.
 */
export class PrimitiveType extends Type {
}

/**
 * A class that represents an enumerated type.
 */
export class EnumType extends Type {
}

/**
 * A class that represents a value of an enumerated type.
 */
export class EnumValue extends Concept {
}

/**
 * A class that represents an structured type, basically a collection of attributes.
 */
export class StructType extends Type {
}

/**
 * A class that represents a list type.
 */
export class ListType extends Type {
}

/**
 * A class that represents a model service.
 */
export class Service extends Concept {
}

/**
 * A class that represents an attribute of an structured type.
 */
export class Attribute extends Concept {
}

/**
 * A class that represents a link of an structured type.
 */
export class Link extends Concept {
}

/**
 * A class that represents a method of a service.
 */
export class Method extends Concept {
}

/**
 * A class that represents a method parameter.
 */
export class Parameter extends Concept {
}

/**
 * A class that represents a service locator.
 */
export class Locator extends Concept {
}

/**
 * A class that represents a model.
 */
export class Model extends Concept {
}
