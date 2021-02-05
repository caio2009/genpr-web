import React, { useEffect, useMemo, useState } from 'react'

import api from '@services/api'

import { Container, Title, AvatarImg } from '@styles/components'
import { StockItemsContainer, StockItem, StockItemData, CultivationName, ClassificationName, Quantity, UnitMeasureAbbreviation } from './styles'
import Modal from '@components/Modal'
import StockItemDetail from './components/StockItemDetail'

const Stock = () => {
  const [productions, setProductions] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  // modal details status
  const [modalDetails, setModalDetails] = useState(false)
  const [keyDetails, setKeyDetails] = useState(Math.random())

  const loadProductions = async () => {
    const res = await api.get('productions?_expand=cultivation&_expand=classification&_expand=unitMeasure&_expand=field')
    setProductions(res.data)
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
        stockItems[index].quantity += production.quantity
        stockItems[index].fields.push({ 
          ...production.field,
          quantity: production.quantity 
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
        quantity: production.quantity,
        fields: [{
          ...production.field,
          quantity: production.quantity
        }]
      })
    }

    stockItems.sort((a, b) => a.cultivation.name.localeCompare(b.cultivation.name))

    return stockItems
  }, [productions])

  const openModalDetails = (index) => {
    setSelectedItem(index)
    setModalDetails(true)
  }

  const closeModalDetails = () => {
    setModalDetails(false)
    setKeyDetails(Math.random())
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
                {item.quantity}
              </Quantity>
              
              <UnitMeasureAbbreviation>
                {item.unitMeasure.abbreviation}
              </UnitMeasureAbbreviation>
            </StockItemData>
          </StockItem>
        ))}
      </StockItemsContainer>

      <Modal 
        key={keyDetails}
        show={modalDetails}
        closeModal={closeModalDetails}
        title="Detalhes do Produto"
        content={(
          <StockItemDetail item={stockItems[selectedItem]} />
        )}
      />
    </Container>
  )
}

export default Stock