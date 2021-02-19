import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import CreateClassificationForm from '@components/Forms/CreateClassificationForm'
import EditClassificationForm from '@components/Forms/EditClassificationForm'

import api from '@services/api'

const CultivationList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeModal } = useModal()

  const [classifications, setClassifications] = useState([])

  const loadClassifications = async () => {
    const res = await api.get('classifications')
    setClassifications(res.data)
  }

  useEffect(() => {
    loadClassifications()
  }, [])

  const openModalCreate = () => {
    openModal({
      title: 'Nova Classificação',
      content: (
        <CreateClassificationForm
          onCreated={handleCreated}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalEdit = (id) => {
    openModal({
      title: 'Editar Classificação',
      content: (
        <EditClassificationForm
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
        await api.delete(`classifications/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadClassifications()
      }
    })
  }

  const handleCreated = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Classificação criada com sucesso!' })
    loadClassifications()
  }

  const handleEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Classificação editada com sucesso!' })
    loadClassifications()
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
          Classificações
        </Title>

        <Button variant="default" onClick={openModalCreate}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {classifications.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openModalEdit(item.id)}
          >
            <ListItemBox grow={1}>
              <p>{item.name}</p>
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