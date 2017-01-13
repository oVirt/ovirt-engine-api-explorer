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

export default class Words {
  /**
   * Capitalizes the given word, conerting the first charater to upper case and the rest of the characters to lower
   * case.
   *
   * @param {String} word - The word to capitalize.
   * @returns {String} The capitalized word.
   */
  static capitalized (word) {
    if (word == null || word.length === 0) {
      return word
    }
    return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
  }
}
