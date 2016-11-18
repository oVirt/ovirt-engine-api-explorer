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

function Method ({ method }) {
  return (
    <tr>
      <td><Link concept={method}/></td>
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
      <td>{locator.name}</td>
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

export default function Service ({ params: { serviceId } }) {
  const services = document.model.services
  const service = concepts.Concept.find(services, serviceId)
  const methods = service.methods
  const locators = service.locators
  return (
    <div>
      <ol className='breadcrumb'>
        <li><a href='#/home'>Home</a></li>
        <li><a href='#/services'>Services</a></li>
        <li><Link concept={service}/></li>
      </ol>

      <h2>{service.name}</h2>
      <Doc concept={service}/>

      <h3>Method summary</h3>
      <Methods methods={methods}/>

      <h3>Locators summary</h3>
      <Locators locators={locators}/>
    </div>
  )
}
