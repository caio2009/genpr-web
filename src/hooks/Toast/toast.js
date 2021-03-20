import React, { useState, createContext, useContext } from 'react'

import ToastContainer from './ToastContainer'

const ToastContext = createContext(null)

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = ({ type = 'success', title, description }) => {
    const id = Math.floor(Math.random() * 100 + 1)

    setToasts(state => [...state, { id, type, title, description }])
  }

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastContainer toasts={toasts} />
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