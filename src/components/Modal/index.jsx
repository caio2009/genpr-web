import React from 'react'
import ReactDOM from 'react-dom'

import { FiX } from 'react-icons/fi'
import { Title } from '../../styles/components'
import { ModalOverlay, ModalWrapper, Modal as Container, ModalHeader, CloseButton, ModalContent, ModalActions } from './styles'

const Modal = ({ title, content, actions, isShowing = false, hide }) => {
  return isShowing ? ReactDOM.createPortal(
    <ModalOverlay isShowing={isShowing}>
      <ModalWrapper>
        <Container>
          <ModalHeader>
            <Title marginBottom={0}>
              {title}
            </Title>

            <CloseButton onClick={hide}>
              <FiX size={24} />
            </CloseButton>
          </ModalHeader>

          {content && 
          <ModalContent>
            {content}
          </ModalContent>}

          {actions &&
          <ModalActions>
            {actions}
          </ModalActions>}
        </Container>
      </ModalWrapper>
    </ModalOverlay>, document.body
  ) : null
}

export default Modal