import styled, { css } from 'styled-components'

export const ActionsBarContainer = styled.div`
  ${props => props.show ? css`
    display: flex;
    justify-content: flex-end;
  ` : css`
    display: none;
  `}

  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
  background: #ddd;
  padding: .5rem;

  button + button {
    margin-left: .25rem;
  }
`