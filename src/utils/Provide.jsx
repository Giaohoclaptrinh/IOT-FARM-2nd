import React, { createContext, useEffect, useReducer, useState } from 'react'
export const  Device = "IS_DEVICE"

export const   context  =  createContext();
export const   devicesObject  =  function(value){
  return  {
    type:Device,
    payload:value,
  }

}
function  Reducer(state, action){
  console.log("reducer run")
  switch(action.type){
    case Device:{
      console.log("setdevice : ", state,action.payload)
      return  {
          ...state,
          devices:action.payload,
          "heh":"test"
          
      }
      return  state

    }
    default:{
      return  state
    }
  }

}
function Provide( {children}) {
  const  [provide,setProvide] = useState({devices:[]})
  const   [state,dispatch] =  useReducer(Reducer,provide)
  useEffect(()=>{
    setProvide((prev)=>{
    return {
      ...prev,
      devices:state.devices
    }
    })
  },[state])

  return (
    <context.Provider value={{state,dispatch}}>
      {
        children
      }

    </context.Provider>
  )
}

export default  Provide