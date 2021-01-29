import React, { createContext, useContext, useState } from "react"

import OptionDialog from '../components/OptionDialog'

const OptionDialogContext = createContext(null)

const OptionDialogProvider = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false)
  const [options, setOptions] = useState([])

  const closeDialog = () => {
    setIsOpened(false)
  }

  const openOptionDialog = (options) => {
    setIsOpened(true)
    setOptions(options)
  }

  return (
    <OptionDialogContext.Provider value={{ openOptionDialog }}>
      <OptionDialog 
        show={isOpened} 
        closeDialog={closeDialog}
        options={options}
      />
      {children}
    </OptionDialogContext.Provider>
  )
}

const useOptionDialog = () => {
  return useContext(OptionDialogContext)
}

export {
  OptionDialogProvider,
  useOptionDialog
}