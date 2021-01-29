import React from 'react'

import { DialogOverlay, Centralizer, Dialog, DialogContent, Option } from './styles'

const OptionDialog = ({ show, closeDialog, options }) => {
  const handleClick = (e, action) => {
    closeDialog()
    action(e)
  }

  return (
    <DialogOverlay show={show} onClick={() => closeDialog()}>
      <Centralizer>
        <Dialog>
          <DialogContent>
            {options.map((option, index) => (
              <Option key={index} onClick={(e) => handleClick(e, option.action)}>
                {option.label}
              </Option>
            ))}
          </DialogContent>
        </Dialog>
      </Centralizer>
    </DialogOverlay>
  )
}

export default OptionDialog