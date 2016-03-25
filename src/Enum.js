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
import Summary from 'Summary'
import * as concepts from 'concepts'

const Value = React.createClass({
  render() {
    var value = this.props.value
    return (
      <tr>
        <td>{value.name}</td>
        <td><Summary concept={value}/></td>
      </tr>
    )
  }
})

const Values = React.createClass({
  render() {
    var type = this.props.type
    var values = type.values.slice(0)
    values.sort(concepts.Concept.compare)
    var rows = []
    for (var i = 0; i < values.length; i++) {
      var value = values[i]
      rows.push(<Value key={value.id} value={value}/>)
    }
    return (
      <div>
        <h3>Values summary ({values.length})</h3>
        <table className='datatable table table-striped table-bordered'>
          <thead>
            <tr>
              <th width='20%'>Name</th>
              <th width='80%'>Summary</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    )
  }
})

export default React.createClass({
  render() {
    var type = this.props.type
    return (
      <div>
        <h2>{type.name} <small>enum</small></h2>
        <Doc concept={type}/>
        <Values type={type}/>
      </div>
    )
  }
})
