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

import React from 'react'
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'

import Doc from 'Doc'
import Documents from 'Documents'
import Member from 'Member'
import Method from 'Method'
import Parameter from 'Parameter'
import Requests from 'Requests'
import Service from 'Service'
import Services from 'Services'
import Type from 'Type'
import Types from 'Types'
import * as concepts from 'concepts'

export default function Content ({ model }) {
  return (
    <div className='container-fluid container-pf-nav-pf-vertical'>
      <div className='row'>
        <div className='col-xs-12'>
          <Router model={model}/>
        </div>
      </div>
    </div>
  )
}

function Router ({ model }) {
  // These small components are intended to get the parameters from the URL, find the concepts and
  // create the corresponding components. This way the logic to do that lookup does not need to be
  // part of the components that display the concepts.
  function allDocuments () {
    return <Documents model={model}/>
  }

  function documentById ({ match: { params: { docId } } }) {
    const doc = concepts.Concept.find(model.documents, docId)
    return <Doc concept={doc}/>
  }

  function allTypes () {
    return <Types model={model}/>
  }

  function typeById ({ match: { params: { typeId } } }) {
    const type = concepts.Concept.find(model.types, typeId)
    return <Type type={type}/>
  }

  function attributeById ({ match: { params: { typeId, attributeId } } }) {
    const declaringType = concepts.Concept.find(model.types, typeId)
    const attribute = concepts.Concept.find(declaringType.attributes, attributeId)
    return <Member member={attribute}/>
  }

  function linkById ({ match: { params: { typeId, linkId } } }) {
    const declaringType = concepts.Concept.find(model.types, typeId)
    const link = concepts.Concept.find(declaringType.attributes, linkId)
    return <Member member={link}/>
  }

  function allServices () {
    return <Services model={model}/>
  }

  function serviceById ({ match: { params: { serviceId } } }) {
    const service = concepts.Concept.find(model.services, serviceId)
    return <Service service={service}/>
  }

  function methodById ({ match: { params: { serviceId, methodId } } }) {
    const service = concepts.Concept.find(model.services, serviceId)
    const method = concepts.Concept.find(service.methods, methodId)
    return <Method method={method}/>
  }

  function parameterById ({ match: { params: { serviceId, methodId, parameterId } } }) {
    const service = concepts.Concept.find(model.services, serviceId)
    const method = concepts.Concept.find(service.methods, methodId)
    const parameter = concepts.Concept.find(method.parameters, parameterId)
    return <Parameter parameter={parameter}/>
  }

  function allRequests () {
    return <Requests model={model}/>
  }

  // Find the identifier of the first document, as that will be used as the home page:
  const docs = model.documents.slice(0)
  const home = docs.sort(concepts.Concept.compare)[0]

  // Render the router:
  return (
    <HashRouter>
      <Switch>
        <Route exact path='/documents' component={allDocuments}/>
        <Route exact path='/documents/:docId' component={documentById}/>
        <Route exact path='/types' component={allTypes}/>
        <Route exact path='/types/:typeId' component={typeById}/>
        <Route exact path='/types/:typeId/attributes/:attributeId' component={attributeById}/>
        <Route exact path='/types/:typeId/links/:linkId' component={linkById}/>
        <Route exact path='/services' component={allServices}/>
        <Route exact path='/services/:serviceId' component={serviceById}/>
        <Route exact path='/services/:serviceId/methods/:methodId' component={methodById}/>
        <Route exact path='/services/:serviceId/methods/:methodId/parameters/:parameterId' component={parameterById}/>
        <Route exact path='/requests' component={allRequests}/>
        <Redirect from='*' to={'/documents/' + home.id}/>
      </Switch>
    </HashRouter>
  )
}
