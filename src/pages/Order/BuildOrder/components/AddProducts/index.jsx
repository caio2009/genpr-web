import React, { useState, useEffect } from 'react'
import { useGlobal } from '@hooks/global'
import { useModal } from '@hooks/modal'

import api from '@services/api'

import { AvatarImg } from '@styles/components'
import { StockItemsContainer, StockItem, StockItemData, CultivationName, ClassificationName, Quantity, UnitMeasureAbbreviation } from './styles'
import AddQuantityAndPrice from '../AddQuantityAndPrice'

import vegetablesImage from '../../../../../assets/images/vegetables.svg'

const AddProducts = ({ onAdd, orderItems = [] }) => {
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
      id: 'quantityAndPrice',
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
    closeModal('quantityAndPrice')
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
            <AvatarImg src={item.cultivation.imageUrl || vegetablesImage} size={4.75} />

            <StockItemData>
              <CultivationName>
                {item.cultivation.fullname}
              </CultivationName>

              <ClassificationName>
                {item.classification.name}
              </ClassificationName>

              <Quantity>
                {
                  item.availableQuantity + 
                  orderItems.filter(
                    orderItem => 
                    orderItem.cultivation.id === item.cultivation.id &&
                    orderItem.classification.id === item.classification.id &&
                    orderItem.unitMeasure.id === item.unitMeasure.id
                  )
                    .map(orderItem => orderItem.quantity)
                    .reduce((prev, curr) => prev + curr, 0) - 
                  cart.filter(
                    product => 
                    product.cultivation.id === item.cultivation.id && 
                    product.classification.id === item.classification.id && 
                    product.unitMeasure.id === item.unitMeasure.id
                  )
                    .map(product => product.quantity)
                    .reduce((prev, curr) => prev + curr, 0)
                }
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