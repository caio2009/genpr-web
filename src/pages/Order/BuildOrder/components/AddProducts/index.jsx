import React, { useState, useEffect, useMemo } from 'react'

import api from '@services/api'

import { AvatarImg } from '@styles/components'
import { StockItemsContainer, StockItem, StockItemData, CultivationName, ClassificationName, Quantity, UnitMeasureAbbreviation } from './styles'
import Modal from '@components/Modal'
import AddQuantityAndPrice from '../AddQuantityAndPrice'

const AddProducts = ({ toggleModal, onAdd }) => {
  const [productions, setProductions] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  // modal add quantity and price status
  const [modalAddQuantityAndPrice, setModalAddQuantityAndPrice] = useState(false)
  const [keyAddQuantityAndPrice, setKeyAddQuantityAndPrice] = useState(Math.random())

  const loadProductions = async () => {
    const res = await api.get('productions?_expand=cultivation&_expand=classification&_expand=unitMeasure&_expand=field')
    setProductions(res.data)
  }

  useEffect(() => {
    loadProductions()
  }, [])

  const openModalAddQuantityAndPrice = (index) => {
    toggleModal()
    setSelectedItem(index)
    setModalAddQuantityAndPrice(true)
  }

  const closeModalAddQuantityAndPrice = () => {
    setModalAddQuantityAndPrice(false)
    setKeyAddQuantityAndPrice(Math.random())
    toggleModal()
  }

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
          quantity: production.quantity,
          productionId: production.id
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
          quantity: production.quantity,
          productionId: production.id
        }]
      })
    }

    stockItems.sort((a, b) => a.cultivation.name.localeCompare(b.cultivation.name))

    return stockItems
  }, [productions])

  const handleProductAdd = (productsToAdd) => {
    setModalAddQuantityAndPrice(false)
    setKeyAddQuantityAndPrice(Math.random())
    onAdd(productsToAdd)
  }

  return (
    <div>
      <p>
        Clique em algum produto que queira adicionar na venda.
      </p>

      <br />

      <StockItemsContainer>
        {stockItems.map((item, index) => (
          <StockItem key={index} onClick={() => openModalAddQuantityAndPrice(index)}>
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
        key={keyAddQuantityAndPrice}
        show={modalAddQuantityAndPrice}
        closeModal={closeModalAddQuantityAndPrice}
        title="Quantidade e Preço"
        content={(
          <AddQuantityAndPrice
            product={stockItems[selectedItem]}
            onAdd={handleProductAdd}
          />
        )}
      />
    </div>
  )
}

export default AddProducts