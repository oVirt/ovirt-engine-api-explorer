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

const Method = React.createClass({
  render() {
    var method = this.props.method
    return (
      <tr>
        <td><Link concept={method}/></td>
        <td><Summary concept={method}/></td>
      </tr>
    )
  }
})

const Methods = React.createClass({
  render() {
    var methods = this.props.methods
    methods.sort(concepts.Concept.compare)
    var rows = []
    for (var i = 0; i < methods.length; i++) {
      var method = methods[i]
      rows.push(<Method key={method.id} method={method}/>)
    }
    return (
      <div>
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

const Locator = React.createClass({
  render() {
    var locator = this.props.locator
    return (
      <tr>
        <td>{locator.name}</td>
        <td>-</td>
        <td><Summary concept={locator}/></td>
      </tr>
    )
  }
})

const Locators = React.createClass({
  render() {
    var locators = this.props.locators
    locators.sort(concepts.Concept.compare)
    var rows = []
    for (var i = 0; i < locators.length; i++) {
      var locator = locators[i]
      rows.push(<Locator key={locator.id} locator={locator}/>)
    }
    return (
      <div>
        <table className='datatable table table-striped table-bordered'>
          <thead>
            <tr>
              <th width='20%'>Name</th>
              <th width='20%'>Target</th>
              <th width='60%'>Summary</th>
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
    var serviceId = this.props.params.serviceId
    var services = document.model.services
    var service = concepts.Concept.find(services, serviceId)
    var methods = service.methods
    var locators = service.locators
    return (
      <div>
        <ol className='breadcrumb'>
          <li><a href='#/home'>Home</a></li>
          <li><a href='#/services'>Services</a></li>
          <li><Link concept={service}/></li>
        </ol>

        <h2>{service.name}</h2>
        <Doc concept={service}/>

        <h3>Method summary ({methods.length})</h3>
        <Methods methods={methods}/>

        <h3>Locators summary ({locators.length})</h3>
        <Locators locators={locators}/>
      </div>
    )
  }
})
