/*
Copyright (c) 2016-2017 Red Hat, Inc.

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
import Link from 'Link'

export default function Documents ({ model }) {
  const docs = model.documents.slice(0)
  const rows = docs
    .sort(concepts.Concept.compare)
    .map((doc) => <Row key={doc.id} doc={doc}/>)

  return (
    <div>
      <h1>Documents</h1>
      <div>{rows}</div>
    </div>
  )
}

function Row ({ doc }) {
  return (
    <div><Link concept={doc}/></div>
  )
}
