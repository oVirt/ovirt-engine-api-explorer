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
import Hrefs from 'Hrefs'
import Names from 'Names'
import * as concepts from 'concepts'

export default function Link ({ concept }) {
  // Check if the concept is deprecated:
  let style = ''
  if (concept && concept.annotations) {
    const deprecated = concepts.Concept.find(concept.annotations, 'deprecated') != null
    if (deprecated) {
      style = deprecated ? 'deprecated' : ''
    }
  }

  // Calculate the text and the href of the link:
  let text
  let href
  if (concept != null) {
    text = buildText(concept)
    href = buildHref(concept)
  }
  else {
    text = '-'
    href = null
  }

  // Render the link:
  if (href) {
    return <a className={style} href={href}>{text}</a>
  }
  return <span className={style}>{text}</span>
}

function buildText (concept) {
  if (concept instanceof concepts.Document) {
    return concept.title
  }
  return Names.render(concept)
}

function buildHref (concept) {
  return Hrefs.render(concept)
}
