import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import CreateCustomerForm from '@components/Forms/CreateCustomerForm'
import EditCustomerForm from '@components/Forms/EditCustomerForm'
import CustomerView from '@components/Containers/ModalViews/CustomerView'

import api from '@services/api'

const CustomerList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeAllModals } = useModal()

  const [customers, setUnitMeasures] = useState([])

  const loadUnitMeasures = async () => {
    const res = await api.get('customers')
    setUnitMeasures(res.data)
  }

  useEffect(() => {
    loadUnitMeasures()
  }, [])

  const openModalCreate = () => {
    openModal({
      id: 'createCustomer',
      title: 'Novo Cliente',
      content: (
        <CreateCustomerForm
          onCreated={handleCreated}
          onCancel={closeAllModals}
        />
      )
    })
  }

  const openModalView = (id) => {
    openModal({
      id: 'viewCustomer',
      title: 'Cliente',
      content: (
        <CustomerView 
          entityId={id}
          onClose={closeAllModals}
          onEditClick={() => openModalEdit(id)}
          onRemoveClick={() => handleRemove(id)}
        />
      )
    })
  }

  const openModalEdit = (id) => {
    closeAllModals()

    openModal({
      id: 'editCustomer',
      title: 'Editar Cliente',
      content: (
        <EditCustomerForm
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
        await api.delete(`customers/${id}`)

        closeAllModals()
        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadUnitMeasures()
      }
    })
  }

  const handleCreated = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Cliente criado com sucesso!' })
    loadUnitMeasures()
  }

  const handleEdited = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Cliente editado com sucesso!' })
    loadUnitMeasures()
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
          Clientes
        </Title>

        <Button variant="default" onClick={openModalCreate}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {customers.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openModalView(item.id)}
          >
            <ListItemBox grow={1}>
              <Subtitle>{item.name}</Subtitle>
              <p>Tel. 1: {item.phone1 ? item.phone1 : 'Não informado'}</p>
              <p>Tel. 2: {item.phone2 ? item.phone2 : 'Não informado'}</p>
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

export default CustomerList;