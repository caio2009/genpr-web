import React from 'react'

import { FiX } from 'react-icons/fi'
import { DialogOverlay, Centralizer, Dialog as Wrapper, DialogHeader, CloseButton, DialogContent, DialogActions } from './styles'
import { Title } from '@styles/components'

const Dialog = ({ show, closeDialog, title, content, actions }) => {
  return (
    <DialogOverlay show={show}>
      <Centralizer>
        <Wrapper>
          <DialogHeader>
            <Title marginBottom={0} size={1.25}>
              {title}
            </Title>

            <CloseButton onClick={closeDialog}>
              <FiX size={24} />
            </CloseButton>
          </DialogHeader>

          <DialogContent>
            {content}
          </DialogContent>

          {actions && 
          <DialogActions>
            {actions}
          </DialogActions>}
        </Wrapper>
      </Centralizer>
    </DialogOverlay>
  )
}

export default Dialog