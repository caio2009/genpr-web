import React from 'react'
import { useHistory } from 'react-router-dom'
import { useGlobal } from '@hooks/global'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useToast } from '@hooks/Toast/toast'
import { useModal } from '@hooks/modal'
import colors from '@styles/colors'

import { FiTrash } from 'react-icons/fi'
import { Container, Title, Subtitle, IconButton } from '@styles/components'
import { Cart, CartItem, ItemDescription, ItemQuantity, ItemControl, Empty, TotalPrice } from './styles'
import Button from '@components/Button'
import AddProducts from './components/AddProducts'
import EditQuantityAndPrice from './components/EditQuantityAndPrice'

const BuildOrder = () => {
  const history = useHistory()
  const { cart, setCartData } = useGlobal()
  const { openConfirmDialog } = useConfirmDialog()
  const { addToast } = useToast()
  const { openModal, closeModal } = useModal()

  const openModalAddProducts = () => {
    openModal({
      id: 'addProduct',
      title: 'Adicionar Produto',
      content: (
        <AddProducts
          onAdd={handleProductAdd}
        />
      )
    })
  }

  const openModalEditQuantityAndPrice = (index) => {
    openModal({
      id: 'editQuantityAndPrice',
      title: 'Quantidade e Preço',
      content: (
        <EditQuantityAndPrice
          product={cart[index]}
          onEdit={handleEditQuantityAndPrice}
        />
      )
    })
  }

  const handleProductAdd = (products) => {
    closeModal('addProduct')
    setCartData([...cart, ...products])
  }

  const handleEditQuantityAndPrice = (product) => {
    closeModal('edtiQuantityAndPrice')

    const newCart = [...cart]

    const index = newCart.findIndex(x => x.field.productionId === product.field.productionId)
    newCart[index] = product

    setCartData(newCart)
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
    if (cart.length > 0) {
      history.push('/vendas/finalizar')
    } else {
      addToast({
        type: 'error',
        title: 'Carrinho vazio',
        description: 'Não é possível realizar uma venda sem produtos adicionados no carrinho!'
      })
    }
  }

  return (
    <Container page>
      <Title>
        Realizar Venda
      </Title>

      <Button full={window.screen.width <= 375} onClick={openModalAddProducts}>
        Adicionar Produto
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
                {item.cultivation.fullname} {item.classification.name} {item.unitMeasure.abbreviation}
              </strong>

              <p>
                {item.ruralProperty.name} / {item.field.name}
              </p>

              <p>
                Preço Unitário: R$ {Number(item.unitPrice).toFixed(2)}
              </p>

              <p>
                Subtotal: R$ {Number(item.unitPrice * item.quantity).toFixed(2)}
              </p>
            </ItemDescription>

            <ItemQuantity>
              <strong>X {item.quantity}</strong>
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
          R$ {cart.map(product => product.quantity * product.unitPrice).reduce((prev, curr) => prev + curr, 0).toFixed(2)}
        </span>
      </TotalPrice>

      <br />

      <Button variant="primary" full={window.screen.width <= 375} onClick={goFinishOrder}>
        Continuar
      </Button>
    </Container>
  )
}

export default BuildOrder