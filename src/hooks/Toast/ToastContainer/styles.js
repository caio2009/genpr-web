import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  top: 0;
  right: 0;
  z-index: 15;

  padding: .5rem .5rem 0 0;

  @media screen and (max-width: 375px) {
    width: 100%;
    padding: .25rem;
  }
`