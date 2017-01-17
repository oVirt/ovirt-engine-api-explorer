/*
Copyright (c) 2017 Red Hat, Inc.

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
import Hrefs from 'Hrefs'
import Names from 'Names'
import Since from 'Since'
import Summary from 'Summary'
import Tables from 'Tables'

function Row ({ point }) {
  const verb = buildVerb(point)
  const path = buildPath(point)
  const method = point.method
  return (
    <tr>
      <td>
        <div>{verb} {path} <Since concept={method}/></div>
        <Summary concept={method}/>
      </td>
    </tr>
  )
}

export default class Requests extends Component {
  render () {
    // Create the list of rows:
    const points = document.model.points
    let key = 0
    const rows = points
      .map((point) => <Row key={key++} point={point}/>)

    // Render the table:
    return (
      <div>

        <h1>Requests</h1>

        <p>
          This page contains the complete list of request available
          in the API.
        </p>

        <table className='datatable table table-striped table-bordered'>
          <colgroup>
            <col style={{width: '10%'}}/>
            <col style={{width: '90%'}}/>
          </colgroup>
          <thead>
            <tr>
              <th>Request</th>
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

function buildVerb (point) {
  // Calculate the text:
  let text
  const method = point.method
  const words = method.name.words
  if (words.length > 1) {
    text = 'POST'
  }
  else {
    switch (words[0]) {
      case 'get':
      case 'list':
        text = 'GET'
        break
      case 'update':
        text = 'PUT'
        break
      case 'remove':
        text = 'DELETE'
        break
      default:
        text = 'POST'
    }
  }

  // Calculate the href:
  const href = Hrefs.render(method)

  // Create the cell:
  return <a href={href}>{text}</a>
}

function buildPath (point) {
  // This list will hold the segments:
  let path = '/ovirt-engine/api'

  // Add the segments for the locator:
  for (let locator of point.path) {
    path += '/'
    path += buildLocatorSegment(locator)
  }

  // If the method is an action, then add the segment for the action:
  const method = point.method
  if (method.isAction()) {
    path += '/'
    path += buildMethodSegment(method)
  }

  // Create the cell:
  return <span>{path}</span>
}

function buildLocatorSegment (locator) {
  let text = Names.lowerJoined(locator.name, '')
  const parameters = locator.parameters
  if (parameters.length > 0) {
    const id = Names.render(parameters[0])
    text = '{' + text + ':' + id + '}'
  }
  return text
}

function buildMethodSegment (method) {
  return Names.lowerJoined(method.name, '')
}
