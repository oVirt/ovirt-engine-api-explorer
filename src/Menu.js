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

function Item ({ doc }) {
  let href = '#/documents/' + doc.id
  return (
    <li>
      <a href={href}>
        <i className='fa fa-book'></i>
        {doc.title}
      </a>
    </li>
  )
}

export default function Menu () {
  // Create the list of items:
  const docs = document.model.documents.slice(0)
  const items = docs
    .sort(concepts.Concept.compare)
    .map((doc) => <Item key={doc.id} doc={doc}/>)

  // Render the menu:
  return (
    <div>
      <div className='nav-category'>
        <h2>Documents</h2>
        <ul className='nav nav-pills nav-stacked'>{items}</ul>
      </div>
      <div className='nav-category'>
        <h2>Reference</h2>
        <ul className='nav nav-pills nav-stacked'>
          <li><a href='#/services'><i className='fa fa-cog'></i>Services</a></li>
          <li><a href='#/types'><i className='fa fa-file-text-o'></i>Types</a></li>
        </ul>
      </div>
    </div>
  )
}
