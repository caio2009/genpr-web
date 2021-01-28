import React, { createContext, useContext, useState } from "react"

import ConfirmDialog from '../components/ConfirmDialog'

const ConfirmDialogContext = createContext(null)

const ConfirmDialogProvider = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false)
  const [data, setData] = useState({})
  const [resolve, setResolve] = useState(null)

  const openConfirmDialog = ({ title, message }) => {
    setIsOpened(true)
    setData({ title, message })

    return new Promise((resolve, reject) => {
      setResolve(() => resolve)       
    })
  }

  const handleResponse = (res) => {
    setData({})
    setIsOpened(false)

    if (res) {
      resolve(true)
    } else {
      resolve(false)
    }
  }

  return (
    <ConfirmDialogContext.Provider value={{ openConfirmDialog }}>
      <ConfirmDialog 
        show={isOpened} 
        title={data.title} 
        message={data.message} 
        onConfirm={() => handleResponse(true)}
        onCancel={() => handleResponse(false)}
      />
      {children}
    </ConfirmDialogContext.Provider>
  )
}

const useConfirmDialog = () => {
  return useContext(ConfirmDialogContext)
}

export {
  ConfirmDialogProvider,
  useConfirmDialog
}