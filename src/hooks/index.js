import React from 'react'

import { GlobalProvider } from './global'
import { DrawerProvider } from './drawer'
import { ToastProvider } from './Toast/toast'
import { ConfirmDialogProvider } from './confirmDialog'
import { OptionDialogProvider } from './optionDialog'
import { SelectDialogProvider } from './selectDialog'
import { DialogProvider } from './dialog'
import { ModalProvider } from './modal'

const AppProvider = ({ children }) => {
  return (
    <GlobalProvider>
      <DrawerProvider>
        <ToastProvider>
          <ConfirmDialogProvider>
            <OptionDialogProvider>
              <SelectDialogProvider>
                <DialogProvider>
                  <ModalProvider>
                    {children}
                  </ModalProvider>
                </DialogProvider>
              </SelectDialogProvider>
            </OptionDialogProvider>
          </ConfirmDialogProvider>
        </ToastProvider>
      </DrawerProvider>
    </GlobalProvider>
  )
}

export default AppProvider