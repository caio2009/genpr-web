import React, { useEffect, useMemo, useState } from 'react'
import { useModal } from '@hooks/modal'

import api from '@services/api'

import { Container, Title, AvatarImg } from '@styles/components'
import { StockItemsContainer, StockItem, StockItemData, CultivationName, ClassificationName, Quantity, UnitMeasureAbbreviation } from './styles'
import StockItemDetail from './components/StockItemDetail'

const Stock = () => {
  const { openModal } = useModal()

  const [productions, setProductions] = useState([])

  const loadProductions = async () => {
    const res = await api.get('productions?_expand=cultivation&_expand=classification&_expand=unitMeasure&_expand=field')
    const productions = res.data
    setProductions(productions.filter(item => item.availableQuantity > 0))
  }

  useEffect(() => {
    loadProductions()
  }, [])

  const isStockItemDuplicated = (a, b) => {
    return (
      a.cultivation.id === b.cultivation.id &&
      a.classification.id === b.classification.id &&
      a.unitMeasure.id === b.unitMeasure.id
    )
  }

  const stockItems = useMemo(() => {
    let stockItems = []

    for (let production of productions) {
      let isDuplicate = false

      for (let item of stockItems) {
        if (isStockItemDuplicated(item, production)) {
          isDuplicate = true
          break
        }
      }

      if (isDuplicate) {
        const index = stockItems.findIndex(item => item.cultivation.id === production.cultivation.id && item.classification.id === production.classification.id && item.unitMeasure.id === production.unitMeasure.id)
        stockItems[index].availableQuantity += production.availableQuantity
        stockItems[index].fields.push({ 
          ...production.field,
          availableQuantity: production.availableQuantity 
        })
        continue
      }

      stockItems.push({
        cultivation: {
          id: production.cultivation.id,
          name: production.cultivation.name.concat(` ${production.cultivation.variety}`),
          imageUrl: production.cultivation.imageUrl
        },
        classification: {
          id: production.classification.id,
          name: production.classification.name
        },
        unitMeasure: {
          id: production.unitMeasure.id,
          abbreviation: production.unitMeasure.abbreviation
        },
        availableQuantity: production.availableQuantity,
        fields: [{
          ...production.field,
          availableQuantity: production.availableQuantity
        }]
      })
    }

    stockItems.sort((a, b) => a.cultivation.name.localeCompare(b.cultivation.name))

    return stockItems
  }, [productions])

  const openModalDetails = (index) => {
    openModal({
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
                {item.cultivation.name}
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