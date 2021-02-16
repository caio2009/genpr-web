import styled from 'styled-components'

export const Wrapper = styled.div`
  & + div {
    margin-top: 1rem;
  }
`

export const ItemDetail = styled.div`
  display: flex;
  flex-direction: column;

  padding: .5rem;
  background: #eee;

  & + div {
    margin-top: .5rem;
  }
`