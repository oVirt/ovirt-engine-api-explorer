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

import React from 'react'

export default function Menu () {
  return (
    <div className='nav-pf-vertical nav-pf-vertical-with-sub-menus'>
      <ul className='list-group'>
        <Item icon='book' path='documents' title='Documents'/>
        <Item icon='send-o' path='requests' title='Requests'/>
        <Item icon='cog' path='services' title='Services'/>
        <Item icon='file-text-o' path='types' title='Types'/>
      </ul>
    </div>
  )
}

function Item ({ icon, path, title }) {
  return (
    <li className='list-group-item'>
      <a href={'#/' + path}>
        <span className={'fa fa-' + icon} title={title}/>
        <span className='list-group-item-value'>{title}</span>
      </a>
    </li>
  )
}
