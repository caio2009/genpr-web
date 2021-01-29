import React from 'react'

import { DrawerProvider } from './drawer'
import { ToastProvider } from './Toast/toast'
import { ConfirmDialogProvider } from './confirmDialog'
import { OptionDialogProvider } from './optionDialog'
import { ModalProvider } from './modal'

const AppProvider = ({ children }) => {
  return (
    <DrawerProvider>
      <ToastProvider>
        <ConfirmDialogProvider>
          <OptionDialogProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </OptionDialogProvider>
        </ConfirmDialogProvider>
      </ToastProvider>
    </DrawerProvider>
  )
}

export default AppProvider