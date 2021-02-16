import { shade } from 'polished'
import styled from 'styled-components'
import colors from '@styles/colors'

export const Container = styled.header`
  display: flex;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  
  width: 100%;
  padding: .25rem 1rem;
  color: #fff;
  background: ${colors.indigo};
`

export const ToggleMenu = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 8px;
  border: none;
  cursor: pointer;
  background: transparent;
  color: inherit;

  &:hover {
    background: ${shade(0.2, colors.indigo)};
  }

  & + div {
    margin-left: .5rem;
  }
`

export const Logo = styled.div`
  flex: 1;
  font-size: 1.5rem;
  font-weight: bold;
`