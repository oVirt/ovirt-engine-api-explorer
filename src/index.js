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
import 'patternfly/dist/js/patternfly.min'

// Load styles:
import 'index.css'
import 'patternfly/dist/css/patternfly.min.css'
import 'patternfly/dist/css/patternfly-additions.min.css'
import 'highlight.js/styles/idea.css'

import React from 'react'
import { render } from 'react-dom'

import App from 'App'
import { analyzeModel } from 'analyzer'

// Download the model from the server, and when it is ready render the application:
$.getJSON('model.json', function (data) {
  // Analyze the model:
  const model = analyzeModel(data)

  // Render the application:
  render(<App model={model}/>, document.getElementById('app'))
})
