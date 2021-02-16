import React, { createContext, useContext, useState } from 'react'

import Dialog from '@components/Dialog'

const DialogContext = createContext(null)

const DialogProvider = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false)
  const [data, setData] = useState({})

  const openDialog = ({ title, content, actions }) => {
    setData({ title, content, actions })
    setIsOpened(true)
  }

  const closeDialog = () => {
    setData({})
    setIsOpened(false)
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      <Dialog 
        show={isOpened}
        title={data.title}
        content={data.content}
        actions={data.actions}
        closeDialog={closeDialog}
      />
      {children}
    </DialogContext.Provider>
  )
}

const useDialog = () => {
  return useContext(DialogContext)
}

export {
  DialogProvider,
  useDialog
}