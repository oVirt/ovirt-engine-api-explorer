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
import Enum from 'Enum'
import Primitive from 'Primitive'
import Struct from 'Struct'
import * as concepts from 'concepts'

export default function Type ({ type }) {
  let detail = ''
  if (type instanceof concepts.PrimitiveType) {
    detail = <Primitive type={type}/>
  }
  else if (type instanceof concepts.EnumType) {
    detail = <Enum type={type}/>
  }
  else if (type instanceof concepts.StructType) {
    detail = <Struct type={type}/>
  }
  return (
    <div>{detail}</div>
  )
}
