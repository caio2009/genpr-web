import styled from 'styled-components'

export const Cart = styled.div`
  display: flex;
  flex-direction: column;
`

export const CartItem = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: space-between; */

  padding: .5rem;
  background: #eee;
  border-radius: 4px;
  cursor: pointer;

  & + div {
    margin-top: .5rem;
  }
`

export const ItemDescription = styled.div`
  display: flex;
  flex-direction: column;

  font-size: .75rem;
`

export const ItemQuantity = styled.div`
  flex: 1;

  text-align: right;
  padding-right: 1rem;
`

export const ItemControl = styled.div``

export const Empty = styled.div`
  padding: 1rem;
  text-align: center;
  background: #eee;
` 

export const TotalPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
`