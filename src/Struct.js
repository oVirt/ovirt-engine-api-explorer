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
import Doc from 'Doc'
import Link from 'Link'
import Names from 'Names'
import Since from 'Since'
import Summary from 'Summary'
import * as concepts from 'concepts'

function MemberRow ({ member }) {
  // Determine what icon to use:
  let icon = 'square-o'
  if (member instanceof concepts.Link) {
    icon = 'external-link'
  }

  // Render the row:
  return (
    <tr>
      <td>
        <i className={'fa fa-' + icon}></i>
        <Link concept={member}/>
        <Since concept={member}/>
      </td>
      <td><Link concept={member.type}/></td>
      <td><Summary concept={member}/></td>
    </tr>
  )
}

function MembersTable (props) {
  const members = props.members.slice(0)
  const rows = members
    .sort(concepts.Concept.compare)
    .map((member) => <MemberRow key={member.id} member={member}/>)
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
  const members = type.attributes.concat(type.links)
  return (
    <div>
      <h2>{Names.render(type)} <small>struct</small></h2>
      <Doc concept={type}/>

      <h3>Members summary</h3>
      <MembersTable members={members}/>
    </div>
  )
}
