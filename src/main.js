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

/**
 * @file This file contains the main module of the application.
 */

// These aren't directly required in this file, but they are indirectly
// needed by some of the styles used in the application:
import 'bootstrap'
import 'datatables.net'
import 'patternfly/dist/js/patternfly.min.js'

import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'

import Document from 'Document'
import Documents from 'Documents'
import Member from 'Member'
import Menu from 'Menu'
import Method from 'Method'
import Parameter from 'Parameter'
import Requests from 'Requests'
import Service from 'Service'
import Services from 'Services'
import Type from 'Type'
import Types from 'Types'
import { analyzeModel } from 'analyzer'
import * as concepts from 'concepts'

// Load styles:
import 'highlight.js/styles/idea.css'

// Initialize the vertical navigation:
$(document).ready(function () {
  $().setupVerticalNavigation(true)
})

// Download the model from the server, and when it is ready render the
// application:
$.getJSON('/ovirt-engine/apidoc/model.json', function (data) {
  document.model = analyzeModel(data)

  // Find the identifier of the first document, as that will be used as
  // the home page:
  const docs = document.model.documents.slice(0)
  const home = docs.sort(concepts.Concept.compare)[0]

  // Render the menu:
  render((
    <Menu/>
  ), document.getElementById('menu'))

  // Render the main content area:
  render((
    <HashRouter>
      <Switch>
        <Route exact path='/documents' component={Documents}/>
        <Route exact path='/documents/:docId' component={Document}/>
        <Route exact path='/types' component={Types}/>
        <Route exact path='/types/:typeId' component={Type}/>
        <Route exact path='/types/:typeId/attributes/:memberId' component={Member}/>
        <Route exact path='/types/:typeId/links/:memberId' component={Member}/>
        <Route exact path='/services' component={Services}/>
        <Route exact path='/services/:serviceId' component={Service}/>
        <Route exact path='/services/:serviceId/methods/:methodId' component={Method}/>
        <Route exact path='/services/:serviceId/methods/:methodId/parameters/:parameterId' component={Parameter}/>
        <Route exact path='/requests' component={Requests}/>
        <Redirect from='*' to={'/documents/' + home.id}/>
      </Switch>
    </HashRouter>
  ), document.getElementById('content'))
})
