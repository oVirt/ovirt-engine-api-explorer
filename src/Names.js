/*
Copyright (c) 2017 Red Hat, Inc.

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

import Words from 'Words'
import * as concepts from 'concepts'

/**
 * This class contains methods useful to do computations with names.
 */
export default class Names {
  /**
   * Capitalizes the words of the name and joins them together.
   *
   * @param {Name} name - The name to capitalize.
   * @returns {String} The capitalized name.
   */
  static capitalized (name) {
    return name.words
      .map((word) => Words.capitalized(word))
      .join('')
  }

  /**
   * Converts the words of the given name to lower case and joins them using the given separator.
   *
   * @param {Name} name - The name to convert.
   * @param {String} separator - The separator.
   * @returns {String} The converted name.
   */
  static lowerJoined (name, separator) {
    return name.words
      .map((word) => word.toLowerCase())
      .join(separator)
  }

  /**
   * Renders the name of the given concept according to its type.
   *
   * @param {Concept} concept - The concept.
   * @returns {String} The rendered name.
   */
  static render (concept) {
    if (concept === null) {
      return ''
    }
    const name = concept.name
    if (concept instanceof concepts.Service) {
      return Names.capitalized(name)
    }
    if (concept instanceof concepts.Method) {
      return Names.lowerJoined(name, '')
    }
    if (concept instanceof concepts.Locator) {
      return Names.lowerJoined(name, '')
    }
    if (concept instanceof concepts.Type) {
      if (concept instanceof concepts.ListType) {
        return Names.render(concept.element) + '[]'
      }
      return Names.capitalized(name)
    }
    return Names.lowerJoined(name, '_')
  }
}
