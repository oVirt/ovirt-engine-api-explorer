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
import Names from 'Names'
import * as concepts from 'concepts'

export default function Link ({ concept }) {
  if (concept == null) {
    return <span>-</span>
  }
  let text = Names.render(concept)
  let href
  if (concept instanceof concepts.Document) {
    href = '#/documents/' + concept.id
    text = concept.title
  }
  else if (concept instanceof concepts.Type) {
    if (concept instanceof concepts.ListType) {
      href = '#/types/' + concept.element.id
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
  if (href) {
    return <a href={href}>{text}</a>
  }
  return <span>{text}</span>
}
