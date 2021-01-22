import React from 'react'

import { DrawerProvider } from './drawer'

const AppProvider = ({children}) => {
  return (
    <DrawerProvider>
      {children}
    </DrawerProvider>
  )
}

export default AppProvider