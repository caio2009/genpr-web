import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${props => props.show ? css`
    display: flex;
    flex-direction: column;
  ` : css`
    display: none;
  `}

  position: absolute;
  top: 48px;

  width: 100%;
  padding: .25rem;
  background: #eee;
  border-bottom: 1px solid #ccc;
`

export const Item = styled.div`
  padding: .5rem;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: #0002;
  }

  & + div {
    margin-top: .25rem;
  }
`;