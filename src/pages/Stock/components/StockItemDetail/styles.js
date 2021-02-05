import styled from 'styled-components'

export const Wrapper = styled.div`
  & + div {
    margin-top: 1rem;
  }

  h4 {
    margin-bottom: .5rem;
  }
`

export const ItemDetail = styled.div`
  display: flex;
  flex-direction: column;

  padding: .5rem;
  background: #eee;
  border-radius: 4px;

  & + div {
    margin-top: .5rem;
  }
`