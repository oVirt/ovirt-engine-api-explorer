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
import Doc from 'Doc'
import Link from 'Link'
import Summary from 'Summary'
import * as concepts from 'concepts'

function Member ({ member }) {
  return (
    <tr>
      <td>{member.name}</td>
      <td><Link concept={member.type}/></td>
      <td><Summary concept={member}/></td>
    </tr>
  )
}

function Members (props) {
  const members = props.members.slice(0)
  const rows = members
    .sort(concepts.Concept.compare)
    .map((member) => <Member key={member.id} member={member}/>)
  return (
    <div>
      <table className='datatable table table-striped table-bordered'>
        <colgroup>
          <col style={{width: '20%'}}/>
          <col style={{width: '20%'}}/>
          <col style={{width: '60%'}}/>
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

export default function Struct ({ type }) {
  const attributes = type.attributes
  const links = type.links
  return (
    <div>
      <h2>{type.name} <small>struct</small></h2>
      <Doc concept={type}/>

      <h3>Attributes summary</h3>
      <Members members={attributes}/>

      <h3>Links summary</h3>
      <Members members={links}/>
    </div>
  )
}
