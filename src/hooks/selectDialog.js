import React, { createContext, useContext, useState } from 'react'

import SelectDialog from '@components/SelectDialog'

const SelectDialogContext = createContext(null)

const SelectDialogProvider = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false)
  const [data, setData] = useState({})
  const [resolve, setResolve] = useState(null)

  const openSelectDialog = ({ title, options }) => {
    setIsOpened(true)
    setData({ title, options })

    return new Promise((resolve, reject) => {
      setResolve(() => resolve)
    })
  }

  const closeSelectDialog = () => {
    setData({})
    setIsOpened(false)
  }

  const handleSelect = (value) => {
    resolve(value)
  }

  return (
    <SelectDialogContext.Provider value={{ openSelectDialog }}>
      <SelectDialog 
        show={isOpened}
        title={data.title}
        options={data.options}
        onSelected={handleSelect}
        closeDialog={closeSelectDialog}
      />
      {children}
    </SelectDialogContext.Provider>
  )
}

const useSelectDialog = () => {
  return useContext(SelectDialogContext)
}

export {
  SelectDialogProvider,
  useSelectDialog
}