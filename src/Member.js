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

import React from 'react'
import Doc from 'Doc'
import Names from 'Names'
import * as concepts from 'concepts'

export default function Member ({ params: { typeId, memberId } }) {
  // Find the declaring type:
  const types = document.model.types
  const declaringType = concepts.Concept.find(types, typeId)

  // Try to find an attribute or link with the given identifier:
  let member = concepts.Concept.find(declaringType.attributes, memberId)
  if (member == null) {
    member = concepts.Concept.find(declaringType.links, memberId)
  }

  // Render the member:
  return (
    <div>
      <h2>{Names.render(member)}</h2>
      <Doc concept={member}/>
    </div>
  )
}
