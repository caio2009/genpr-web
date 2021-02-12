import React, { useState, useEffect, useMemo } from 'react'
import { useGlobal } from '@hooks/global'

import api from '@services/api'

import { AvatarImg } from '@styles/components'
import { StockItemsContainer, StockItem, StockItemData, CultivationName, ClassificationName, Quantity, UnitMeasureAbbreviation } from './styles'
import Modal from '@components/Modal'
import AddQuantityAndPrice from '../AddQuantityAndPrice'

const AddProducts = ({ toggleModal, onAdd }) => {
  const { cart } = useGlobal()

  const [productions, setProductions] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  // modal add availableQuantity and price status
  const [modalAddQuantityAndPrice, setModalAddQuantityAndPrice] = useState(false)
  const [keyAddQuantityAndPrice, setKeyAddQuantityAndPrice] = useState(Math.random())

  const loadProductions = async () => {
    const res = await api.get('productions?_expand=cultivation&_expand=classification&_expand=unitMeasure&_expand=field')
    const productions = res.data
    setProductions(productions.filter(item => item.availableQuantity > 0))
  }

  useEffect(() => {
    loadProductions()
  }, [])

  const openModalAddQuantityAndPrice = (index) => {
    toggleModal()
    setSelectedItem(index)
    setKeyAddQuantityAndPrice(Math.random())
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
        stockItems[index].availableQuantity += production.availableQuantity
        stockItems[index].fields.push({
          ...production.field,
          availableQuantity: production.availableQuantity,
          productionId: production.id
        })
        continue
      }

      stockItems.push({
        productionId: production.id,
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
          availableQuantity: production.availableQuantity,
          productionId: production.id
        }]
      })
    }

    stockItems.sort((a, b) => a.cultivation.name.localeCompare(b.cultivation.name))

    cart.forEach(product => {
      const index = stockItems.findIndex(item => item.productionId === product.productionId)

      if (index !== -1) {
        stockItems[index].availableQuantity -= product.orderedQuantity
      }
    })

    return stockItems
  }, [productions, cart])

  const handleProductAdd = (productsToAdd) => {
    toggleModal()
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
                {item.availableQuantity}
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