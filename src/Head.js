/*
Copyright (c) 2017 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react'

export default function Head () {
  return (
    <nav className='navbar navbar-pf-vertical'>
      <div className='navbar-header'>
        <button type='button' className='navbar-toggle'>
          <span className='sr-only'>Toggle navigation</span>
          <span className='icon-bar'/>
          <span className='icon-bar'/>
          <span className='icon-bar'/>
        </button>
        <a className='navbar-brand' href='#/home'>
          <div className='navbar-brand-icon'/>
        </a>
      </div>
    </nav>
  )
}
