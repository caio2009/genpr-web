import styled from 'styled-components'
import { shade } from 'polished'

export const StockItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: 375px) {
    flex-direction: column;
  }
` 

export const StockItem = styled.div`
  display: flex;
  align-items: center;
  
  width: calc(20% - .25rem);
  padding: .5rem;
  background: #eee;
  border-radius: 4px;
  margin: .125rem;
  cursor: pointer;
  transition: background-color .2s;

  &:hover {
    background: ${shade(0.1, '#eee')};
  }

  @media screen and (max-width: 768px) {
    width: calc(50% - .25rem);
  }

  @media screen and (max-width: 375px) {
    width: 100%;
  }
`

export const StockItemData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  p {
    text-align: center;
  }
`

export const CultivationName = styled.p`
  font-size: 1rem;
  color: #777;
`

export const ClassificationName = styled.p`
  font-size: 1rem;
  font-weight: bold;
`

export const Quantity = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
`

export const UnitMeasureAbbreviation = styled.p`
  font-size: .75rem;
  color: #777;
`