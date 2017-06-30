
import React from 'react'
import Spinner from 'react-spinkit'

export let Loader = () => {
  return (
      <div className='spinner'>
        <Spinner name="ball-clip-rotate-multiple" fadeIn='none' color="steelblue"/>
      </div>
  )
}
