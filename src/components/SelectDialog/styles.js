import styled, { css } from 'styled-components'
import { shade } from 'polished'
import { Title as TTitle } from '@styles/components'

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
  background: #0003;
`

export const Centralizer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  width: 100%;
  height: 100%;
`

export const Dialog = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;

  width: 75%;
  max-height: 50%;
  background: #fff;
  overflow-y: auto;
`

export const Option = styled.div`
  padding: .75rem .5rem;
  transition: background-color .2s;
  cursor: pointer;

  &:hover {
    background: ${shade(0.1, '#fff')};
  }

  & + div {
    border-top: 1px solid #ddd;
  }
`

export const Title = styled(TTitle)`
  position: sticky;
  top: 0;
  left: 0;

  padding: .5rem;
  margin-bottom: 0;
  background: #fff;
  /* border-bottom: 1px solid #ddd; */
`