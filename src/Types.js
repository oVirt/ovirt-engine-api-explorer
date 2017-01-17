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
import Since from 'Since'
import Summary from 'Summary'
import * as concepts from 'concepts'

function Row ({ type }) {
  return (
    <tr>
      <td>
        <Link concept={type}/>
        <Since concept={type}/>
      </td>
      <td><Summary concept={type}/></td>
    </tr>
  )
}

export default class Types extends Component {
  render () {
    // Create the list of rows:
    const types = document.model.types.slice(0)
    const rows = types
      .sort(concepts.Concept.compare)
      .map((type) => <Row key={type.id} type={type}/>)

    // Render the component:
    return (
      <div>

        <h1>Types</h1>

        <p>
          This page contains the complete list of names and summaries of all the
          types used in the API. Click on the type names to see the details.
        </p>

        <table className='datatable table table-striped table-bordered'>
          <colgroup>
            <col style={{width: '20%'}}/>
            <col style={{width: '80%'}}/>
          </colgroup>
          <thead>
            <tr>
              <th>Name</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>

      </div>
    )
  }

  componentDidMount () {
    const element = ReactDOM.findDOMNode(this)
    $('.datatable', element).dataTable({
      drawCallback (settings) {
        if ($('.sidebar-pf').length > 0) {
          $(document).sidebar()
        }
      },
    })
  }
}
