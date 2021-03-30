import styled from 'styled-components'
import { shade } from 'polished'

export const StockItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  margin: -.25rem;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`

export const StockItem = styled.div`
  display: flex;
  align-items: center;
  
  width: calc(33% - .5rem);
  padding: .5rem;
  background: #eee;
  margin: .25rem;
  cursor: pointer;
  transition: background-color .2s;

  &:hover {
    background: ${shade(0.1, '#eee')};
  }

  @media screen and (min-width: 768px) and (max-width: 1024px) {
    width: calc(50% - .5rem);
  }

  @media screen and (max-width: 767px) {
    width: calc(100% - .5rem);
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