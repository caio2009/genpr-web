import React, { useState, createContext, useContext } from 'react'

import ToastContainer from './ToastContainer'

const ToastContext = createContext(null)

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = ({ type = 'success', title, description }) => {
    const id = Math.floor(Math.random() * 100 + 1)

    const toast = { id, type, title, description }

    setToasts(state => [...state, toast])
  }

  const removeToast = (id) => {
    setToasts(state => state.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  )
}

const useToast = () => {
  return useContext(ToastContext)
}

export {
  ToastProvider,
  useToast
}