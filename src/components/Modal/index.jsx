import React from 'react'
import ReactDOM from 'react-dom'

import { FiX } from 'react-icons/fi'
import { Title } from '../../styles/components'
import { ModalOverlay, Centralizer, Modal as Wrapper, ModalHeader, CloseButton, ModalContent, ModalActions } from './styles'

const Modal = ({ show, closeModal, title, content, actions, fullPage = false }) => {
  return ReactDOM.createPortal(
    <ModalOverlay show={show}>
      <Centralizer>
        <Wrapper isFullPage={fullPage}>
          <ModalHeader>
            <Title marginBottom={0}>
              {title}
            </Title>

            <CloseButton onClick={closeModal}>
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
        </Wrapper>
      </Centralizer>
    </ModalOverlay>, document.body
  )
}

export default Modal