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
import * as concepts from 'concepts'

export default function Since ({ concept }) {
  // Determine the version where this was added:
  const since = concepts.Concept.find(concept.annotations, 'since')
  let badge = <span/>
  if (since != null && since.parameters.length > 0) {
    const parameter = since.parameters[0]
    if (parameter.values.length > 0) {
      badge = <span className='badge'>{parameter.values[0]}</span>
    }
  }
  return badge
}
