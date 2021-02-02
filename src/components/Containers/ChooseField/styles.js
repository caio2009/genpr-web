import styled from 'styled-components'
import { shade } from 'polished'

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const Option = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1rem;
  border: none;
  border-radius: 4px;
  background: #eee;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color .2s;

  &:hover {
    background: ${shade(0.1, '#eee')};
  }

  & + button {
    margin-top: .5rem;
  }
`