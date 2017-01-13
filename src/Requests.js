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

function Row ({ point }) {
  const method = buildMethodCell(point)
  const path = buildPathCell(point)
  return (
    <tr>
      <td>{method}</td>
      <td>{path}</td>
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
              <th>Method</th>
              <th>Path</th>
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
      order: [[1, 'asc']],
    })
  }
}

function buildMethodCell (point) {
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

function buildPathCell (point) {
  // This list will hold the segments:
  let segments = []
  segments.push(<span>/ovirt-engine/api</span>)

  // Add the segments for the locator:
  for (let locator of point.path) {
    segments.push(<span>/</span>)
    segments.push(buildLocatorSegment(locator))
  }

  // If the method is an action, then add the segment for the action:
  const method = point.method
  if (method.isAction()) {
    segments.push(<span>/</span>)
    segments.push(buildMethodSegment(method))
  }

  // Create the cell:
  return <span>{segments}</span>
}

function buildLocatorSegment (locator) {
  const text = Names.lowerJoined(locator.name, '')
  const href = Hrefs.render(locator.service)
  const parameters = locator.parameters
  if (parameters.length > 0) {
    const id = Names.render(parameters[0])
    return (
      <span>{'{'}<a href={href}>{text}</a>:{id}{'}'}</span>
    )
  }
  return (
    <a href={href}>{text}</a>
  )
}

function buildMethodSegment (method) {
  const text = Names.lowerJoined(method.name, '')
  const href = Hrefs.render(method)
  return (
    <a href={href}>{text}</a>
  )
}
