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

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Doc from 'Doc'
import Link from 'Link'
import Names from 'Names'
import Since from 'Since'
import Summary from 'Summary'
import Tables from 'Tables'
import * as concepts from 'concepts'

function ParameterRow ({ parameter }) {
  let direction = ''
  let icon = ''
  if (parameter.in && !parameter.out) {
    direction = 'In'
    icon = 'long-arrow-right'
  }
  else if (!parameter.in && parameter.out) {
    direction = 'Out'
    icon = 'long-arrow-left'
  }
  else if (parameter.in && parameter.out) {
    direction = 'In/Out'
    icon = 'arrows-h'
  }
  return (
    <tr>
      <td>
        <i className={'fa fa-' + icon}/>
        <Link concept={parameter}/>
        <Since concept={parameter}/>
      </td>
      <td><Link concept={parameter.type}/></td>
      <td>{direction}</td>
      <td><Summary concept={parameter}/></td>
    </tr>
  )
}

function ParametersTable (props) {
  const parameters = props.parameters.slice(0)
  const rows = parameters
    .sort(concepts.Concept.compare)
    .map((parameter) => <ParameterRow key={parameter.id} parameter={parameter}/>)
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

export default class Method extends Component {
  render () {
    // Find the method:
    const method = this.props.method
    const parameters = method.parameters

    // Calculate the summary:
    let summary
    if (parameters.length > 0) {
      summary = (
        <div>
          <h3>Parameters summary</h3>
          <ParametersTable parameters={parameters}/>
        </div>
      )
    }
    else {
      summary = (
        <div/>
      )
    }

    // Render the component:
    return (
      <div>
        <h2>{Names.render(method)}</h2>
        <Doc concept={method}/>
        {summary}
      </div>
    )
  }

  componentDidMount () {
    const element = ReactDOM.findDOMNode(this)
    Tables.initialize(element)
  }
}
