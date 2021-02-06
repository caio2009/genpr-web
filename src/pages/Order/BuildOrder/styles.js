import styled from 'styled-components'

export const Cart = styled.div`
  display: flex;
  flex-direction: column;
`

export const CartItem = styled.div`
  display: flex;

  padding: .5rem;
  background: #eee;
  border-radius: 4px;

  & + div {
    margin-top: .5rem;
  }
`