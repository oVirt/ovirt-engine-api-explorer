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

import * as concepts from 'concepts'

export default class Hrefs {
  static render (concept) {
    if (concept instanceof concepts.Document) {
      return '#/documents/' + concept.id
    }
    if (concept instanceof concepts.Type) {
      if (concept instanceof concepts.ListType) {
        return Hrefs.render(concept.element)
      }
      return '#/types/' + concept.id
    }
    if (concept instanceof concepts.Attribute) {
      return Hrefs.render(concept.declaringType) + '/attributes/' + concept.id
    }
    if (concept instanceof concepts.Link) {
      return Hrefs.render(concept.declaringType) + '/links/' + concept.id
    }
    if (concept instanceof concepts.Service) {
      return '#/services/' + concept.id
    }
    if (concept instanceof concepts.Method) {
      return Hrefs.render(concept.service) + '/methods/' + concept.id
    }
    if (concept instanceof concepts.Parameter) {
      return Hrefs.render(concept.method) + '/parameters/' + concept.id
    }
    return ''
  }
}
