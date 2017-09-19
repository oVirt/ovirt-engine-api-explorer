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

function Method ({ method }) {
  return (
    <tr>
      <td>
        <Link concept={method}/>
        <Since concept={method}/>
      </td>
      <td><Summary concept={method}/></td>
    </tr>
  )
}

function Methods ({ methods }) {
  const rows = methods
    .sort(concepts.Concept.compare)
    .map((method) => <Method key={method.id} method={method}/>)
  return (
    <div>
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

function Locator ({ locator }) {
  return (
    <tr>
      <td>{Names.render(locator)}</td>
      <td><Link concept={locator.service}/></td>
      <td><Summary concept={locator}/></td>
    </tr>
  )
}

function Locators ({ locators }) {
  const rows = locators
    .sort(concepts.Concept.compare)
    .map((locator) => <Locator key={locator.id} locator={locator}/>)
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
            <th>Service</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

export default class Service extends Component {
  render () {
    // Find the service:
    const serviceId = this.props.match.params.serviceId
    const services = document.model.services
    const service = concepts.Concept.find(services, serviceId)

    // Create the summary of methods:
    const methods = service.methods
    let methodsSummary
    if (methods.length > 0) {
      methodsSummary = (
        <div>
          <h3>Methods summary</h3>
          <Methods methods={methods}/>
        </div>
      )
    }
    else {
      methodsSummary = (
        <div/>
      )
    }

    // Create the summary of locators:
    const locators = service.locators
    let locatorsSummary
    if (locators.length > 0) {
      locatorsSummary = (
        <div>
          <h3>Locators summary</h3>
          <Locators locators={locators}/>
        </div>
      )
    }
    else {
      locatorsSummary = (
        <div/>
      )
    }

    return (
      <div>
        <h2>{Names.render(service)}</h2>
        <Doc concept={service}/>
        {methodsSummary}
        {locatorsSummary}
      </div>
    )
  }

  componentDidMount () {
    const element = ReactDOM.findDOMNode(this)
    Tables.initialize(element)
  }
}
