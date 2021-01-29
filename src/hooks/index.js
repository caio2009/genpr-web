import React from 'react'

import { DrawerProvider } from './drawer'
import { ToastProvider } from './Toast/toast'
import { ConfirmDialogProvider } from './confirmDialog'
import { OptionDialogProvider } from './optionDialog'

const AppProvider = ({ children }) => {
  return (
    <DrawerProvider>
      <ToastProvider>
        <ConfirmDialogProvider>
          <OptionDialogProvider>
            {children}
          </OptionDialogProvider>
        </ConfirmDialogProvider>
      </ToastProvider>
    </DrawerProvider>
  )
}

export default AppProvider