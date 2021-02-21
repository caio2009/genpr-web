import styled from 'styled-components'
import { shade } from 'polished'

export const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;

  & + div {
    margin-top: .5rem;
  }
`

export const AccordionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: .5rem;
  border: none;
  background: #eee;
  transition: background-color .2s;
  font-size: 1.25rem;

  &:hover {
    background: ${shade(0.1, '#eee')}
  }
`

export const AccordionPanel = styled.div`
  display: ${props => props.show ? 'block' : 'none'};

  padding: .5rem;
`