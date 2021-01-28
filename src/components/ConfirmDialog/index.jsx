import React from 'react'

import { DialogOverlay, Centralizer, Dialog, DialogHeader, DialogContent, DialogActions } from './styles'
import { Title, FlexRow, ActionButton } from '../../styles/components'


const ConfirmDialog = ({ show, title, message, onConfirm, onCancel }) => {
  return (
    <DialogOverlay show={show}>
      <Centralizer>
        <Dialog>
          {title &&
            <DialogHeader>
              <Title size={1.25} marginBottom={0}>
                {title}
              </Title>
            </DialogHeader>}

          <DialogContent>
            {message}
          </DialogContent>

          <DialogActions>
            <FlexRow gap={1}>
              <ActionButton color="purple" onClick={onConfirm}>
                Confirmar
              </ActionButton>
              <ActionButton color="red" transparent onClick={onCancel}>
                Cancelar
              </ActionButton>
            </FlexRow>
          </DialogActions>
        </Dialog>
      </Centralizer>
    </DialogOverlay>
  )
}

export default ConfirmDialog