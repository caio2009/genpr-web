import React from 'react'

import { GlobalProvider } from './global'
import { DrawerProvider } from './drawer'
import { ToastProvider } from './Toast/toast'
import { ConfirmDialogProvider } from './confirmDialog'
import { OptionDialogProvider } from './optionDialog'

const AppProvider = ({ children }) => {
  return (
    <GlobalProvider>
      <DrawerProvider>
        <ToastProvider>
          <ConfirmDialogProvider>
            <OptionDialogProvider>
              {children}
            </OptionDialogProvider>
          </ConfirmDialogProvider>
        </ToastProvider>
      </DrawerProvider>
    </GlobalProvider>
  )
}

export default AppProvider