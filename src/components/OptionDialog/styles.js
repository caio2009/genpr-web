import styled, { css } from 'styled-components'
import { shade } from 'polished'

export const DialogOverlay = styled.div`
  ${props => props.show ? css`
    display: block;
  ` : css`
    display: none;
  `}

  position: fixed;
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

export const Dialog = styled.div`
  display: block;

  padding: .5rem 0;
  width: 75%;
  background: #fff;
  /* border-radius: 4px; */
`

export const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const Option = styled.button`
  padding: .5rem;
  border: none;
  font-size: 1rem;
  background: transparent;

  &:hover {
    background: ${shade(0.1, '#fff')};
  }
`