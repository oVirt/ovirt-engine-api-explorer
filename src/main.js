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

/**
 * @file This file contains the main module of the application.
 */

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'

import Home from 'Home'
import Method from 'Method'
import Service from 'Service'
import Services from 'Services'
import Type from 'Type'
import Types from 'Types'
import { analyzeModel } from 'analyzer'

// Download the model from the server, and when it is ready render the
// application:
$.getJSON('model.json', function (data) {
  document.model = analyzeModel(data);

  // This is needed in order to avoid the "_k=.." added by default when
  // using the ReactJS router module:
  const history = useRouterHistory(createHashHistory)({ queryKey: false })
  render((
    <Router history={history}>
      <Route path='/types' component={Types}/>
      <Route path='/types/:typeId' component={Type}/>
      <Route path='/services' component={Services}/>
      <Route path='/services/:serviceId' component={Service}/>
      <Route path='/services/:serviceId/methods/:methodId' component={Method}/>
      <Route path='*' component={Home}/>
    </Router>
  ), document.getElementById('content'))
})
