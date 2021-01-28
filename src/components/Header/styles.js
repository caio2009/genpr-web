import { shade } from 'polished'
import styled from 'styled-components'

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
  background: #311b92;
`

export const ToggleMenu = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: inherit;

  &:hover {
    background: ${shade(0.2, '#1a237e')};
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