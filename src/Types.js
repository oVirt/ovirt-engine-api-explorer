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
import Link from 'Link'
import Summary from 'Summary'
import * as concepts from 'concepts'

function Row ({ type }) {
  return (
    <tr>
      <td><Link concept={type}/></td>
      <td><Summary concept={type}/></td>
    </tr>
  )
}

export default class Types extends Component {
  render () {
    // Create the list of rows:
    var rows = []
    var types = document.model.types.slice(0);
    types.sort(concepts.Concept.compare)
    for (var i = 0; i < types.length; i++) {
      var type = types[i]
      rows.push(<Row key={type.id} type={type}/>)
    }

    // Render the component:
    return (
      <div>

        <ol className='breadcrumb'>
          <li><a href='#/home'>Home</a></li>
          <li><a href='#/types'>Types</a></li>
        </ol>

        <h1>Types ({types.length})</h1>

        <p>
          This page contain the complete list of names and summaries of all the
          types used in the API. Click on the type names to see the details.
        </p>

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

  componentDidMount () {
    var element = ReactDOM.findDOMNode(this)
    $('.datatable', element).DataTable()
  }
}


