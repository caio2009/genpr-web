import React, { useState } from 'react'

import { Container, Title, Subtitle } from '@styles/components'
import { Cart, CartItem } from './styles'
import Button from '@components/Button'
import Modal from '@components/Modal'
import AddProducts from './components/AddProducts'

const BuildOrder = () => {
  const [modalAddProduct, setModalAddProduct] = useState(false)
  const [keyAddProduct, setKeyAddProduct] = useState(Math.random())
  const [cartItems, setCartItems] = useState([])

  const closeModalAddProduct = () => {
    setModalAddProduct(false)
    setKeyAddProduct(Math.random())
  }

  const handleProductAdd = (productsToAdd) => {
    setCartItems([...cartItems, ...productsToAdd])
  }

  return (
    <Container page>
      <Title>
        Realizar Venda
      </Title>

      <Button full onClick={() => setModalAddProduct(true)}>
        Adicionar Produtos
      </Button>

      <br />

      <Subtitle>
        Produtos Adicionados
      </Subtitle>

      <Cart>
        {cartItems.map((item, index) => (
          <CartItem key={index}>
            {item.ruralProperty.name} - {item.field.name} - {item.cultivation.name} {item.classification.name} {item.orderedQuantity} {item.unitMeasure.name}
          </CartItem>
        ))}
      </Cart>

      <Modal
        key={keyAddProduct}
        show={modalAddProduct}
        closeModal={closeModalAddProduct}
        title="Adicionar Produtos"
        content={(
          <AddProducts 
            toggleModal={() => setModalAddProduct(!modalAddProduct)} 
            onAdd={handleProductAdd}
          />
        )}
      />
    </Container>
  )
}

export default BuildOrder