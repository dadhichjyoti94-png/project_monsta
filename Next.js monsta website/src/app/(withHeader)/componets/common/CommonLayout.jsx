'use client'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/ReduxToolkit/ReduxStore'
import { ToastContainer } from 'react-toastify'


export default function CommonLayout({children}) {
  return (
    <div>
      <ToastContainer/>
        <Provider store={store}>
        {children}
        </Provider>
      
    </div>
  )
}
