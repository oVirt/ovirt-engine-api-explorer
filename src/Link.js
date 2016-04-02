/*
Copyright (c) 2016 Red Hat, Inc.

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

import React from 'react'
import * as concepts from 'concepts'

export default function Link ({ concept }) {
  var text = concept.name
  var href
  if (concept instanceof concepts.Type) {
    if (concept instanceof concepts.ListType) {
      var item = concept.element
      href = '#/types/' + item.id
      text = item.name + '[]'
    }
    else {
      href = '#/types/' + concept.id
    }
  }
  else if (concept instanceof concepts.Service) {
    href = '#/services/' + concept.id
  }
  else if (concept instanceof concepts.Method) {
    href =
      '#/services/' + concept.service.id +
      '/methods/' + concept.id
  }
  else if (concept instanceof concepts.Parameter) {
    href =
      '#/services/' + concept.method.service.id +
      '/methods/' + concept.method.id +
      '/parameters/' + concept.id
  }
  else if (concept) {
    text = concept.toString()
  }
  else {
    text = '?'
  }
  if (href) {
    return <a href={href}>{text}</a>
  }
  return <span>{text}</span>
}
