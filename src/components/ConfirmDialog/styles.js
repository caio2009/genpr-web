import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
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

export const DialogWrapper = styled.div`
  display: flex;
  flex-direction: column;

  max-width: 75%;
  background: #fff;
  border-radius: 4px;

  & > div {
    padding: .5rem;
  }
`

export const Header = styled.div``

export const Content = styled.div``

export const Actions = styled.div`
  display: flex;
`