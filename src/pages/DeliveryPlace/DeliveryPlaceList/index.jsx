import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import CreateDeliveryPlaceForm from '@components/Forms/CreateDeliveryPlaceForm'
import EditDeliveryPlaceForm from '@components/Forms/EditDeliveryPlaceForm'
import DeliveryPlaceView from '@components/Containers/ModalViews/DeliveryPlaceView'

import api from '@services/api'

const CultivationList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeModal } = useModal()

  const [deliveryPlaces, setClassifications] = useState([])

  const loadDeliveryPlaces = async () => {
    const res = await api.get('deliveryPlaces')
    setClassifications(res.data)
  }

  useEffect(() => {
    loadDeliveryPlaces()
  }, [])

  const openModalCreate = () => {
    openModal({
      title: 'Novo Local de Entrega',
      content: (
        <CreateDeliveryPlaceForm
          onCreated={handleCreated}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalView = (id) => {
    openModal({
      title: 'Local de Entrega',
      content: (
        <DeliveryPlaceView 
          entityId={id}
          onCloes={closeModal}
          onEditClick={() => openModalEdit(id)}
          onRemoveClick={() => handleRemove(id)}
        />
      )
    })
  }

  const openModalEdit = (id) => {
    openModal({
      title: 'Editar Local de Entrega',
      content: (
        <EditDeliveryPlaceForm
          entityId={id}
          onEdited={handleEdited}
          onCancel={closeModal}
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
        await api.delete(`deliveryPlaces/${id}`)

        closeModal()
        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadDeliveryPlaces()
      }
    })
  }

  const handleCreated = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Local de entrega criado com sucesso!' })
    loadDeliveryPlaces()
  }

  const handleEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Local de entrega editado com sucesso!' })
    loadDeliveryPlaces()
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
          Locais de Entrega
        </Title>

        <Button variant="default" onClick={openModalCreate}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {deliveryPlaces.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openModalView(item.id)}
          >
            <ListItemBox grow={1}>
              <p>{item.description}</p>
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

export default CultivationList;