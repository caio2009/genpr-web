import styled from 'styled-components'
import { shade } from 'polished'
import colors from '@styles/colors'

export const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  margin: -.25rem;
`

export const OptionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  
  border: 2px solid ${colors.purple};
  padding: 1rem;
  margin: .25rem;
  cursor: pointer;
  transition: background-color .2s;

  &:hover {
    background: ${shade(0.1, '#fff')};
  }

  img {
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    text-align: center;
  }
`