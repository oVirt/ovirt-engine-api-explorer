/*
Copyright (c) 2015-2016 Red Hat, Inc.

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
 * @file This file contains the functions used to convert JSON objects returned by the server into instances of the
 * model classes, like `Type`, `Service`, etc.
 */

import * as concepts from 'concepts'

/**
 * Analyzes the given JSON data as returned by the`/ovirt-engine/api/model.json` resource and returns a `Model` object
 * containing the same data.
 *
 * @param {Object} - A JSON object containing the model description.
 * @param {Model} - A `Model` object containg the same data.
 */
export function analyzeModel (data) {
  const model = new concepts.Model()

  // Analyze the list of standalone documents:
  model.documents = data.documents ? data.documents.map(analyzeDocument) : []

  // Analyze the list of types:
  model.types = data.types ? data.types.map(analyzeType) : []

  // Analyze the list of services:
  model.services = data.services ? data.services.map(analyzeService) : []

  // Replace attribute and link type specifications with references to the actual types:
  for (let type of model.types) {
    if (type instanceof concepts.StructType) {
      resolveTypes(type.attributes, model.types)
      resolveTypes(type.links, model.types)
    }
  }

  // Replace method parameter type specifications with references to the actual types:
  for (let service of model.services) {
    for (let method of service.methods) {
      resolveTypes(method.parameters, model.types)
    }
  }

  // Replace locator target service identifiers with references to the actual services:
  for (let service of model.services) {
    for (let locator of service.locators) {
      locator.service = concepts.Concept.find(model.services, locator.service)
    }
  }

  return model
}

function analyzeDocument (data) {
  const doc = new concepts.Document()
  analyzeCommon(doc, data)
  return doc
}

function analyzeType (data) {
  let type
  if (data.kind === 'primitive') {
    type = analyzePrimitiveType(data)
  }
  else if (data.kind === 'enum') {
    type = analyzeEnumType(data)
  }
  else {
    type = analyzeStructType(data)
  }
  return type
}

function analyzePrimitiveType (data) {
  const type = new concepts.PrimitiveType()
  analyzeCommon(type, data)
  return type
}

function analyzeEnumType (data) {
  const type = new concepts.EnumType()
  analyzeCommon(type, data)

  // Analyze the list of values:
  type.values = data.values ? data.values.map(analyzeEnumValue) : []

  return type
}

function analyzeEnumValue (data) {
  const value = new concepts.EnumValue()
  analyzeCommon(value, data)
  return value
}

function analyzeStructType (data) {
  const type = new concepts.StructType()
  analyzeCommon(type, data)

  // Analyze the list of attributes:
  type.attributes = data.attributes ? data.attributes.map(analyzeAttribute) : []

  // Analyze the list of links:
  type.links = data.links ? data.links.map(analyzeLink) : []

  return type
}

function analyzeAttribute (data) {
  const attribute = new concepts.Attribute()
  analyzeCommon(attribute, data)

  // Save the type specification, which will be later replaced by the reference to the corresponding type object:
  if (data.type) {
    attribute.type = data.type
  }

  return attribute
}

function analyzeLink (data) {
  const link = new concepts.Link()
  analyzeCommon(link, data)

  // Save the type specification, which will be later replaced by the reference to the corresponding type object:
  if (data.type) {
    link.type = data.type
  }

  return link
}

function analyzeService (data) {
  const service = new concepts.Service()
  analyzeCommon(service, data)

  // Analyze the list of methods:
  service.methods = []
  if (data.methods) {
    service.methods = data.methods.map((method) => {
      const analyzedMethod = analyzeMethod(method)
      analyzedMethod.service = service
      return analyzedMethod
    })
  }

  // Analyze the list of locators:
  service.locators = data.locators ? data.locators.map(analyzeLocator) : []

  return service
}

function analyzeMethod (data) {
  const method = new concepts.Method()
  analyzeCommon(method, data)

  // Analyze the list of parameters:
  method.parameters = []
  if (data.parameters) {
    method.parameters = data.parameters.map((parameter) => {
      const analyzedParameter = analyzeParameter(parameter)
      analyzedParameter.method = method
      return analyzedParameter
    })
  }

  return method
}

function analyzeParameter (data) {
  const parameter = new concepts.Parameter()
  analyzeCommon(parameter, data)

  // Copy the direction flags:
  parameter.in = data.in
  parameter.out = data.out

  // Save the type specification, which will be later replaced by the reference to the corresponding type object:
  if (data.type) {
    parameter.type = data.type
  }

  return parameter
}

function analyzeLocator (data) {
  const locator = new concepts.Locator()
  analyzeCommon(locator, data)

  // Save the identifier of the target service, it will be later replaced by the reference to the actual service:
  locator.service = data.service

  return locator
}

function analyzeCommon (concept, data) {
  analyzeName(concept, data)
  analyzeDoc(concept, data)
}

function analyzeName (concept, data) {
  concept.id = data.name
  concept.name = data.name
}

function analyzeDoc (concept, data) {
  if (data.doc) {
    concept.doc = data.doc
    concept.html = data.html
    const i = concept.html.indexOf('.')
    if (i !== -1) {
      concept.summary = concept.html.substring(0, i + 1)
    }
    else {
      concept.summary = concept.html
    }
  }
  else {
    concept.summary = ''
    concept.doc = ''
    concept.html = ''
  }
}

/**
 * Iterates an array of concepts, looking for references to types (attributes named `type`) and replaces those that
 * are strings with the reference to the type object.
 *
 * @param {Concept[]} concepts - An array of concepts, that may have references to types.
 * @param {Type[]} types - An array containing all the valid types.
 */
function resolveTypes (concepts, types) {
  for (let concept of concepts) {
    resolveType(concept, types)
  }
}

/**
 * Replaces type specifications with references to the type objects.
 *
 * @param {Concept} object - The object that may contain `type` attributes referencing types.
 * @param {Type[]} types - An array containing the valid types.
 */
function resolveType (concept, types) {
  let spec = concept.type
  let type
  let element
  if (spec) {
    if (spec.length >= 2 && spec.substring(spec.length - 2) === '[]') {
      spec = spec.substring(0, spec.length - 2)
      element = concepts.Concept.find(types, spec)
      type = new concepts.ListType()
      type.element = element
    }
    else {
      type = concepts.Concept.find(types, spec)
    }
    concept.type = type
  }
}
