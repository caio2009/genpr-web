import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import Modal from '@components/Modal'
import CreateDeliveryPlaceForm from '@components/Forms/CreateDeliveryPlaceForm'
import EditDeliveryPlaceForm from '@components/Forms/EditDeliveryPlaceForm'

import api from '@services/api'

const CultivationList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()

  const [deliveryPlaces, setClassifications] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  // create delivery place modal status
  const [modalCreate, setModalCreate] = useState(false)
  const [keyCreate, setKeyCreate] = useState(Math.random())

  // edit delivery place modal status
  const [modalEdit, setModalEdit] = useState(false)
  const [keyEdit, setKeyEdit] = useState(Math.random())

  const loadDeliveryPlaces = async () => {
    const res = await api.get('deliveryPlaces')
    setClassifications(res.data)
  }

  useEffect(() => {
    loadDeliveryPlaces()
  }, [])

  const closeCreateModal = () => {
    setModalCreate(false)
    setKeyCreate(Math.random())
  }

  const closeEditModal = () => {
    setModalEdit(false)
    setKeyEdit(Math.random())
  }

  const openEditModal = (id) => {
    setModalEdit(true)
    setSelectedId(id)
  }

  const handleRemove = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`deliveryPlaces/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadDeliveryPlaces()
      }
    })
  }

  const handleCreated = () => {
    setKeyCreate(Math.random())
    addToast({ title: 'Sucesso', description: 'Local de entrega criado com sucesso!' })
    setModalCreate(false)
    loadDeliveryPlaces()
  }

  const handleEdited = () => {
    setKeyEdit(Math.random())
    addToast({ title: 'Sucesso', description: 'Local de entrega editado com sucesso!' })
    setModalEdit(false)
    loadDeliveryPlaces()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Remover', action: () => handleRemove(id) }
    ])
  }

  return (
    <Container page>
      <FlexRow alignItems="center">
        <Title marginBottom={0} flex={1}>
          Locais de Entrega
        </Title>

        <Button variant="default" onClick={() => setModalCreate(true)}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {deliveryPlaces.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openEditModal(item.id)}
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

      <Modal
        key={keyCreate}
        show={modalCreate}
        closeModal={closeCreateModal}
        title="Novo Local de Entrega"
        content={(
          <CreateDeliveryPlaceForm
            onCreated={handleCreated}
            onCancel={closeCreateModal}
          />
        )}
      />

      <Modal
        key={keyEdit}
        show={modalEdit}
        closeModal={closeEditModal}
        title="Local de Entrega"
        content={(
          <EditDeliveryPlaceForm
            entityId={selectedId}
            onEdited={handleEdited}
            onCancel={closeEditModal}
          />
        )}
      />
    </Container>
  )
}

export default CultivationList;