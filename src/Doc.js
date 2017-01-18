/*
Copyright (c) 2016-2017 Red Hat, Inc.

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
import hljs from 'highlight.js'

export default class Doc extends Component {
  render () {
    return <div/>
  }

  componentDidMount () {
    this.renderHtml()
  }

  componentDidUpdate () {
    this.renderHtml()
  }

  renderHtml () {
    const concept = this.props.concept
    if (concept.dom == null && concept.html != null) {
      // Create a DOM tree fro the HTML:
      const dom = $.parseHTML(concept.html)

      // Run the syntax highligher:
      $('pre.highlightjs', dom).each((index, value) => {
        hljs.highlightBlock(value)
      })

      // Replace the Asciidoctor 'tableblock' class with the classes used by Patternfly, so that tables included in
      // the documentation are rendered with the same style used in tables generated dynamically:
      $('table.tableblock', dom)
        .removeClass()
        .addClass('datatable table table-striped table-bordered')

      // Save the generated DOM so that it doesn't need to be calculated again later:
      concept.dom = dom
    }
    if (concept.dom != null) {
      const element = ReactDOM.findDOMNode(this)
      $(element).empty().append(concept.dom)
    }
  }
}
