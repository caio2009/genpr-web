import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${props => props.show ? css`
    display: flex;
    flex-direction: column;
  ` : css`
    display: none;
  `}

  position: fixed;
  top: 48px;
  z-index: 10;

  width: 100%;
  height: calc(100vh - 48px);
  background: #0005;
`

export const DrawerContainer = styled.div`
  position: absolute;
  top: 0px;

  width: 100%;
  padding: .25rem;
  background: #eee;

  &:after {
    content: '';
    display: block;
    box-shadow: 0 0 2px 2px #0005;
    transform: translateY(6px);
  }
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