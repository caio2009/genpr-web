import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useGlobal } from '@hooks/global'
import { useConfirmDialog } from '@hooks/confirmDialog'
import colors from '@styles/colors'

import { FiTrash } from 'react-icons/fi'
import { Container, Title, Subtitle, IconButton } from '@styles/components'
import { Cart, CartItem, ItemDescription, ItemQuantity, ItemControl, Empty, TotalPrice } from './styles'
import Button from '@components/Button'
import Modal from '@components/Modal'
import AddProducts from './components/AddProducts'
import EditQuantityAndPrice from './components/EditQuantityAndPrice'

const BuildOrder = () => {
  const history = useHistory()
  const { cart, setCartData } = useGlobal()
  const { openConfirmDialog } = useConfirmDialog()

  const [selectedProduct, setSelectedProduct] = useState(null)

  // modal add product status
  const [modalAddProduct, setModalAddProduct] = useState(false)
  const [keyAddProduct, setKeyAddProduct] = useState(Math.random())

  // modal edit product status
  const [modalEditQuantityAndPrice, setModalEditQuantityAndPrice] = useState(false)
  const [keyEditQuantityAndPrice, setKeyEditQuantityAndPrice] = useState(Math.random())

  // useEffect(() => {
  //   setCartData([])
  //   // eslint-disable-next-line
  // }, [])

  const openModalEditQuantityAndPrice = (index) => {
    setSelectedProduct(index)
    setModalEditQuantityAndPrice(true)
  }

  const closeModalAddProduct = () => {
    setModalAddProduct(false)
    setKeyAddProduct(Math.random())
  }

  const closeModalEditQuantityAndPrice = () => {
    setModalEditQuantityAndPrice(false)
    setKeyEditQuantityAndPrice(Math.random())
  }

  const handleProductAdd = (productsToAdd) => {
    setCartData([...cart, ...productsToAdd])
  }

  const handleEditQuantityAndPrice = (product) => {
    const newCart = [...cart]

    const index = newCart.findIndex(x => x.field.productionId === product.field.productionId)
    newCart[index] = product

    setCartData(newCart)

    setModalEditQuantityAndPrice(false)
    setKeyEditQuantityAndPrice(Math.random())
  }

  const removeProduct = (e, index) => {
    e.stopPropagation()

    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Tem certeza que deseja remover esse item da venda?'
    }).then(res => {
      if (res) {
        const newCart = [...cart]
        newCart.splice(index, 1)
        setCartData(newCart)
      }
    })
  }

  const goFinishOrder = () => {
    history.push('/vendas/finalizar')
  }

  return (
    <Container page>
      <Title>
        Realizar Venda
      </Title>

      <Button onClick={() => setModalAddProduct(true)}>
        Adicionar Produtos
      </Button>

      <br />

      <Subtitle>
        Produtos Adicionados
      </Subtitle>

      <Cart>
        {cart.map((item, index) => (
          <CartItem key={index} onClick={() => openModalEditQuantityAndPrice(index)}>
            <ItemDescription>
              <strong>
                {item.cultivation.name} {item.classification.name} {item.unitMeasure.abbreviation}
              </strong>

              <p>
                Origem: {item.ruralProperty.name} / {item.field.name}
              </p>

              <p>
                Preço Unitário: R$ {Number(item.unitPrice).toFixed(2)}
              </p>

              <p>
                Subtotal: R$ {Number(item.unitPrice * item.orderedQuantity).toFixed(2)}
              </p>
            </ItemDescription>

            <ItemQuantity>
              <strong>X {item.orderedQuantity}</strong>
            </ItemQuantity>

            <ItemControl>
              <IconButton onClick={(e) => removeProduct(e, index)}>
                <FiTrash size={20} color={colors.red} />
              </IconButton>
            </ItemControl>
          </CartItem>
        ))}

        {!cart.length && (
          <Empty>
            <i>Nenhum produto foi adicionado.</i>
          </Empty>
        )}
      </Cart>

      <TotalPrice>
        <span>
          Total:
        </span>

        <span>
          R$ {cart.map(product => product.orderedQuantity * product.unitPrice).reduce((prev, curr) => prev + curr, 0).toFixed(2)}
        </span>
      </TotalPrice>

      <br />

      <Button variant="primary" onClick={goFinishOrder}>
        Continuar
      </Button>

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

      <Modal
        key={keyEditQuantityAndPrice}
        show={modalEditQuantityAndPrice}
        closeModal={closeModalEditQuantityAndPrice}
        title="Quantidade e Preço"
        content={(
          <EditQuantityAndPrice
            product={cart[selectedProduct]}
            onEdit={handleEditQuantityAndPrice}
          />
        )}
      />
    </Container>
  )
}

export default BuildOrder