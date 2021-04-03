import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import EditOrderForm from '@components/Forms/EditOrderForm'
import CreatedOrderModal from '../CreatedOrderModal'

import api from '@services/api'
import { format } from 'date-fns'
import currencyFormat from '@utils/currencyFormat'

const OrderList = () => {
  const history = useHistory()
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeAllModals } = useModal()

  const [orders, setOrders] = useState([])

  const openCreatedOrderModal = useCallback(async (orderId) => {
    if (orderId) {
      const res = await api.get(`orders/${orderId}`)
      const order = res.data

      openModal({
        id: 'success',
        content: (
          <CreatedOrderModal order={order} />
        )
      })
    }

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // if a new order have been created than open a modal
    // displaying a success message
    openCreatedOrderModal(history.location.state?.orderId)

    // eslint-disable-next-line
  }, [])

  const loadOrders = async () => {
    const res = await api.get('orders')
    setOrders(res.data)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const goBuildOrder = () => {
    history.push('/vendas/criar')
  }

  const openModalEdit = (id) => {
    openModal({
      id: 'editOrder',
      title: 'Editar Venda',
      content: (
        <EditOrderForm
          entityId={id}
          onEdited={handleEdited}
          onCancel={closeAllModals}
        />
      )
    })
  }

  const handleRemove = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`orders/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadOrders()
      }
    })
  }

  const handleEdited = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Venda editada com sucesso!' })
    loadOrders()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Editar', action: () => openModalEdit(id) },
      { label: 'Remover', action: () => handleRemove(id) }
    ])
  }

  return (
    <Container page>
      <FlexRow alignItems="center">
        <Title marginBottom={0} flex={1}>
          Vendas
        </Title>

        <Button variant="default" onClick={goBuildOrder}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {orders.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openModalEdit(item.id)}
          >
            <ListItemBox grow={1}>
              <h4>Venda {format(new Date(item.date), 'dd/MM/yyyy')}</h4>
              <p>Cliente: {item.customer.name || item.customer}</p>
              <p>Local de entrega: {item.deliveryPlace.description || item.deliveryPlace}</p>
              <p>Placa do veículo: {item.licensePlate.code || item.licensePlate || 'Não informado'}</p>
              <p>Total: {currencyFormat(item.totalPrice)}</p>
            </ListItemBox>

            <ListItemBox>
              <IconButton onClick={(e) => handleOpenOptionDialog(e, item.id)}>
                <FiMoreVertical size={24} />
              </IconButton>
            </ListItemBox>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default OrderList;