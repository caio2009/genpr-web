import styled, { css } from 'styled-components'
import { shade } from 'polished'

const variant = {
  default: { background: '#ddd', color: '#000' },
  primary: { background: '#361190', color: '#fff' },
  error: { background: '#b71c1c', color: '#fff' },
  warning: { background: '#f9a825', color: '#000' },
  info: { background: '#01579b', color: '#fff' }
}

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: .5rem 2rem;
  border: none;
  font-size: 1rem;
  border-radius: 4px;
  background: ${props => props.variant ? variant[props.variant].background : variant.default.background};
  color: ${props => props.variant ? variant[props.variant].color : variant.default.color};
  transition: background-color .2s;

  ${props => props.isFull && css`
    width: 100%;
  `}

  &:hover {
    background: ${props => shade(0.1, props.variant ? variant[props.variant].background : variant.default.background)};
  }
`