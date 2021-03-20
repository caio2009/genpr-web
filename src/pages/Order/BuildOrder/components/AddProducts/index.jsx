import React, { useState, useEffect } from 'react'
import { useGlobal } from '@hooks/global'
import { useModal } from '@hooks/modal'

import api from '@services/api'

import { AvatarImg } from '@styles/components'
import { StockItemsContainer, StockItem, StockItemData, CultivationName, ClassificationName, Quantity, UnitMeasureAbbreviation } from './styles'
import AddQuantityAndPrice from '../AddQuantityAndPrice'

const AddProducts = ({ onAdd }) => {
  const { cart } = useGlobal()
  const { openModal, closeModal } = useModal()

  const [stockItems, setStockItems] = useState([])

  const loadStockItems = async () => {
    const res = await api.get('stock')
    setStockItems(res.data)
  }

  useEffect(() => {
    loadStockItems()
  }, [])

  const openModalAddQuantityAndPrice = (index) => {
    openModal({
      title: 'Quantidade e Preço',
      content: (
        <AddQuantityAndPrice
          product={stockItems[index]}
          onAdd={handleProductAdd}
        />
      )
    })
  }

  const handleProductAdd = (productsToAdd) => {
    closeModal()
    onAdd(productsToAdd)
  }

  return (
    <div>
      <p>
        Clique em algum produto para adicionar na venda.
      </p>

      <br />

      <StockItemsContainer>
        {stockItems.map((item, index) => (
          <StockItem key={index} onClick={() => openModalAddQuantityAndPrice(index)}>
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
    </div>
  )
}

export default AddProducts