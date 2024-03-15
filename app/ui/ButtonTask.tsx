'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { createTask } from '../lib/script';

function ButtonTask() {
    
  async function handleClick(){
    createTask();
  }
  return (
    <button className="flex items-center border bg-white p-2 rounded-lg" onClick={ handleClick}>
    <PlusIcon className="w-4 mr-2"/>
    <p>Add a task</p>  
  </button>
  )
}

export default ButtonTask
