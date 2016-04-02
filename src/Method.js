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

function Parameter ({ parameter }) {
  var direction = ''
  if (parameter.in && !parameter.out) {
    direction = 'In'
  }
  else if (!parameter.in && parameter.out) {
    direction = 'Out'
  }
  else if (parameter.in && parameter.out) {
    direction = 'In/Out'
  }
  return (
    <tr>
      <td>{parameter.name}</td>
      <td><Link concept={parameter.type}/></td>
      <td>{direction}</td>
      <td><Summary concept={parameter}/></td>
    </tr>
  )
}

function Parameters (props) {
  var parameters = props.parameters.slice(0)
  parameters.sort(concepts.Concept.compare)
  var rows = []
  for (var i = 0; i < parameters.length; i++) {
    var parameter = parameters[i]
    rows.push(<Parameter key={parameter.id} parameter={parameter}/>)
  }
  return (
    <div>
      <table className='datatable table table-striped table-bordered'>
        <colgroup>
          <col style={{width: '15%'}}/>
          <col style={{width: '15%'}}/>
          <col style={{width: '10%'}}/>
          <col style={{width: '60%'}}/>
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Direction</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

export default function Method ({ params: { serviceId, methodId } }) {
  var services = document.model.services
  var service = concepts.Concept.find(services, serviceId)
  var methods = service.methods
  var method = concepts.Concept.find(methods, methodId)
  var parameters = method.parameters
  return (
    <div>
      <h2>{method.name}</h2>
      <Doc concept={method}/>

      <h3>Parameters summary ({parameters.length})</h3>
      <Parameters parameters={parameters}/>
    </div>
  )
}
