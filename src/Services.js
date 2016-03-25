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
import ReactDOM from 'react-dom'
import Link from 'Link'
import Summary from 'Summary'
import * as concepts from 'concepts'

const Row = React.createClass({
  render() {
    var service = this.props.service;
    return (
      <tr>
        <td><Link concept={service}/></td>
        <td><Summary concept={service}/></td>
      </tr>
    )
  }
})

export default React.createClass({
  render() {
    // Create the list of rows:
    var rows = []
    var services = document.model.services.slice(0)
    services.sort(concepts.Concept.compare)
    for (var i = 0; i < services.length; i++) {
      var service = services[i]
      rows.push(<Row key={service.id} service={service}/>)
    }

    // Render the component:
    return <div>

      <ol className='breadcrumb'>
        <li><a href='#/home'>Home</a></li>
        <li><a href='#/services'>Services</a></li>
      </ol>

      <h1>Services ({rows.length})</h1>

      <p>
        This page contain the names and summarios of all the services provided
        by the API. Click on the names to see more details.
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
  },

  componentDidMount: function() {
    var element = ReactDOM.findDOMNode(this)
    $('.datatable', element).DataTable()
  },
})
