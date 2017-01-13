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
 * This class represents a name formed of multiple words. It is intended to simplify the use of different strategies
 * for representing names as strings, like using different separators or using camel case. The words that form the
 * name are stored separated, so there is no need to parse the name each time that the words are needed.
 */
export class Name {
  /**
   * Creates a new word using the given array of words.
   *
   * @param {String[]) words - The words that will be used to construct the name.
   */
  constructor (words) {
    this._words = words.map((word) => word.toLowerCase())
  }

  /**
   * Returns the array of words of this name. The returned array is a copy of the one used internally, so any changes
   * to it won't have any effect on this name, and changes in the name won't affect the returned array.
   *
   * @returns {String[]} A copy of the list of words of the name.
   */
  get words () {
    return this._words.slice()
  }

  /**
   * Returns a string representation of this name, consisting on the list of words of the name separated by underscores.
   *
   * @returns {String} The string representation of the name.
   */
  toString () {
    return this.words.join('_')
  }

  /**
   * Compares two names lexicographically.
   *
   * @param {Concept} left - The first name to compare.
   * @param {Concept} right - The second name to compare.
   */
  static compare (left, right) {
    const leftSize = left._words.size()
    const rightSize = right._words.size()
    const minSize = Math.min(leftSize, rightSize)
    for (var i = 0; i < minSize; i++) {
      const leftWord = left._words[i]
      const rightWord = right._words[i]
      const result = leftWord.localeCompare(rightWord)
      if (result !== 0) {
        return result
      }
    }
    return leftSize - rightSize
  }
}

/**
 * This class contains methods useful for converting strings to names.
 */
export class NameParser {
  /**
   * Separates the given text into words, using the given separator character, and creates a new name containing
   * those words. For example, to convert the text "my_favorite_fruit" into a name the method can be used as
   * follows:
   *
   * <pre>
   * const name = NameParser.parseUsingSeparator('my_favorite_fruit', '_')
   * </pre>
   *
   * @param {String} text - The text to process.
   * @param {String} separator - The character that separates words.
   * @returns {Name} The name composed of the words extracted from the text.
   */
  static parseUsingSeparator (text, separator) {
    return new Name(text.split(separator))
  }
}

/**
 * A class that represents a model concept.
 */
export class Concept {
  /**
   * Returns the name of this concept.
   *
   * @returns {Name} The name of the concept.
   */
  get name () {
    return this._name
  }

  /**
   * Sets the name of this concept.
   *
   * @param {Name} name - The new name for the concept.
   */
  set name (name) {
    this._name = name
  }

  /**
   * Generates a string representation of this concept, usually just its name.
   *
   * @returns {String} The string representation of the concept.
   */
  toString () {
    return this._name !== null ? this._name.toString() : ''
  }

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
    return array.find((concept) => concept.id === id)
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

/**
 * A class that represents an standalone document.
 */
export class Document extends Concept {
}
