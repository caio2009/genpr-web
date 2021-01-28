import React from 'react'

import { DrawerProvider } from './drawer'
import { ToastProvider } from './Toast/toast'

const AppProvider = ({ children }) => {
  return (
    <DrawerProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </DrawerProvider>
  )
}

export default AppProvider