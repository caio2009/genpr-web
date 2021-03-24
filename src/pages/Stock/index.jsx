import React, { useEffect, useState } from 'react'
import { useModal } from '@hooks/modal'

import api from '@services/api'

import { Container, Title, AvatarImg } from '@styles/components'
import { StockItemsContainer, StockItem, StockItemData, CultivationName, ClassificationName, Quantity, UnitMeasureAbbreviation } from './styles'
import StockItemDetail from './components/StockItemDetail'

const Stock = () => {
  const { openModal } = useModal()

  const [stockItems, setStockItems] = useState([])

  const loadProductions = async () => {
    const res = await api.get('stock')
    const stockItems = res.data
    setStockItems(stockItems)
  }

  useEffect(() => {
    loadProductions()
  }, [])

  const openModalDetails = (index) => {
    openModal({
      id: 'productDetails',
      title: 'Detalhes do Produto',
      content: (
        <StockItemDetail item={stockItems[index]} />
      )
    })
  }

  return (
    <Container page>
      <Title>
        Estoque de Produtos
      </Title>

      <StockItemsContainer>
        {stockItems.map((item, index) => (
          <StockItem key={index} onClick={() => openModalDetails(index)}>
            <AvatarImg src={item.cultivation.imageUrl} size={4.75} />

            <StockItemData>
              <CultivationName>
                {item.cultivation.fullname}
              </CultivationName>
              
              <ClassificationName>
                {item.classification.name}
              </ClassificationName>
              
              <Quantity>
                {item.availableQuantity}
              </Quantity>
              
              <UnitMeasureAbbreviation>
                {item.unitMeasure.abbreviation}
              </UnitMeasureAbbreviation>
            </StockItemData>
          </StockItem>
        ))}
      </StockItemsContainer>
    </Container>
  )
}

export default Stock