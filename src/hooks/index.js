import React from 'react'

import { GlobalProvider } from './global'
import { DrawerProvider } from './drawer'
import { ToastProvider } from './Toast/toast'
import { ConfirmDialogProvider } from './confirmDialog'
import { OptionDialogProvider } from './optionDialog'
import { DialogProvider } from './dialog'
import { ModalProvider } from './modal'

const AppProvider = ({ children }) => {
  return (
    <GlobalProvider>
      <DrawerProvider>
        <ToastProvider>
          <ConfirmDialogProvider>
            <OptionDialogProvider>
              <DialogProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </DialogProvider>
            </OptionDialogProvider>
          </ConfirmDialogProvider>
        </ToastProvider>
      </DrawerProvider>
    </GlobalProvider>
  )
}

export default AppProvider