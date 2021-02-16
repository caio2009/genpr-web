import styled, { css } from 'styled-components'

export const DialogOverlay = styled.div`
  ${props => props.show ? css`
    display: block;
  ` : css`
    display: none;
  `}

  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;

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

export const Dialog = styled.div`
  display: flex;
  flex-direction: column;

  max-width: 75%;
  background: #fff;
  /* border-radius: 4px; */
`

export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: .75rem;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;
  background: transparent;
`

export const DialogContent = styled.div`
  padding: .75rem;
`

export const DialogActions = styled.div`
  display: flex;

  padding: .25rem;
`