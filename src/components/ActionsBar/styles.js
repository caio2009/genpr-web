import styled, { css } from 'styled-components'
import colors from '../../styles/colors'

export const ActionsBarContainer = styled.div`
  ${props => props.show ? css`
    display: flex;
    justify-content: flex-start;
  ` : css`
    display: none;
  `}

  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
  background: #eee;
  padding: .5rem;
  border-top: 1px solid ${colors.lightPurple};

  button + button {
    margin-left: .25rem;
  }
`