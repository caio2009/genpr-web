import styled, { css } from 'styled-components'
import { shade } from 'polished'
import colors from '@styles/colors'

const variant = {
  default: { background: '#ddd', color: '#000' },
  primary: { background: colors.indigo, color: '#fff' },
  error: { background: colors.red, color: '#fff' },
  warning: { background: colors.yellow, color: '#000' },
  info: { background: colors.teal, color: '#fff' }
}

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: .5rem 1.5rem;
  border: none;
  font-size: 1rem;
  background: ${props => props.variant ? variant[props.variant].background : variant.default.background};
  color: ${props => props.variant ? variant[props.variant].color : variant.default.color};
  transition: background-color .2s;

  ${props => props.isTransparent && css`
    background: transparent;
    color: ${props => props.variant ? variant[props.variant].background : variant.default.background};
  `}

  ${props => props.isFull && css`
    width: 100%;
  `}

  &:hover {
    ${props => !props.isTransparent ? css`
      background: ${props => shade(0.1, props.variant ? variant[props.variant].background : variant.default.background)};
    ` : css`
      background: #0002;
    `}
  }
`