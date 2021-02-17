import styled, { css } from 'styled-components'

export const ModalOverlay = styled.div`
  ${props => props.show ? css`
    display: block;
  ` : css`
    display: none;
  `}

  position: absolute;
  top: 0;
  left: 0;
  z-index: 15;

  width: 100%;
  height: 100vh;
  background: #0005;
`

export const Centralizer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`

export const Modal = styled.div`
  display: flex;
  flex-direction: column;

  width: 75%;
  background: #fff;
  /* border-radius: 4px; */
  max-height: 100%;
  overflow-y: auto;

  & > div {
    padding: .5rem;
  }

  @media screen and (max-width: 375px) {
    width: 100%;
    height: 100%;
  }

  ${props => props.isFullPage && css`
    width: 100%;
    height: 100vh;
  `}
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;
  background: transparent;
`

export const ModalContent = styled.div``

export const ModalActions = styled.div``