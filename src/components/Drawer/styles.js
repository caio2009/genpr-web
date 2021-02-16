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
  max-height: 0;
  overflow: hidden;
  padding: .25rem;
  background: #fff;
  transition: max-height .2s ease-out;

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

  &:hover {
    background: #0001;
  }

  & + div {
    margin-top: .25rem;
  }
`;