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
import Tables from 'Tables'
import * as concepts from 'concepts'

function Row ({ service }) {
  return (
    <tr>
      <td>
        <Link concept={service}/>
        <Since concept={service}/>
      </td>
      <td><Summary concept={service}/></td>
    </tr>
  )
}

export default class Services extends Component {
  render () {
    // Create the list of rows:
    const services = document.model.services.slice(0)
    const rows = services
      .sort(concepts.Concept.compare)
      .map((service) => <Row key={service.id} service={service}/>)

    // Render the component:
    return (
      <div>

        <h1>Services</h1>

        <p>
          This page contain the names and summaries of all the services provided
          by the API. Click on the names to see more details.
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
    Tables.initialize(element)
  }
}
