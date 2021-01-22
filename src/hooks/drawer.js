import React, { createContext, useContext, useState } from 'react'

const DrawerContext = createContext({})

const DrawerProvider = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false)

  const toggleDrawer = (value) => {
    if (value !== undefined) {
      setIsOpened(value)
      return
    }
    setIsOpened(!isOpened)
  }

  return (
    <DrawerContext.Provider value={{ isOpened, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  )
}

const useDrawer = () => {
  return useContext(DrawerContext)
}

export {
  DrawerProvider,
  useDrawer
}