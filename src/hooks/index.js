import React from 'react'

import { DrawerProvider } from './drawer'
import { ToastProvider } from './Toast/toast'
import { ConfirmDialogProvider } from './confirmDialog'

const AppProvider = ({ children }) => {
  return (
    <DrawerProvider>
      <ToastProvider>
        <ConfirmDialogProvider>
          {children}
        </ConfirmDialogProvider>
      </ToastProvider>
    </DrawerProvider>
  )
}

export default AppProvider