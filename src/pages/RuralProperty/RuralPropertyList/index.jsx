import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import CreateRuralPropertyForm from '@components/Forms/CreateRuralPropertyForm'
import EditRuralPropertyForm from '@components/Forms/EditRuralPropertyForm'
import RuralPropertyView from '@components/Containers/ModalViews/RuralPropertyView'

import api from '@services/api'

const RuralPropertyList = () => {
  const history = useHistory()
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeAllModals } = useModal()

  const [ruralProperties, setRuralProperties] = useState([])

  const loadRuralProperties = async () => {
    const res = await api.get('rural-properties')
    setRuralProperties(res.data)
  }

  useEffect(() => {
    loadRuralProperties()
  }, [])

  const openModalCreate = () => {
    openModal({
      id: 'createRuralProperty',
      title: 'Nova Propriedade Rural',
      content: (
        <CreateRuralPropertyForm
          onCreated={handleCreated}
          onCancel={closeAllModals}
        />
      )
    })
  }

  const openModalView = (id) => {
    openModal({
      id: 'viewRuralProperty',
      title: 'Propriedade Rural',
      content: (
        <RuralPropertyView 
          entityId={id}
          onClose={closeAllModals}
          onManageClick={() => goManageRuralProperty(id)}
          onEditClick={() => openModalEdit(id)}
          onRemoveClick={() => handleRemove(id)}
        />
      )
    })
  }

  const openModalEdit = (id) => {
    closeAllModals()

    openModal({
      id: 'editRuralProperty',
      title: 'Editar Propriedade Rural',
      content: (
        <EditRuralPropertyForm
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
        await api.delete(`rural-properties/${id}`)

        closeAllModals()
        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadRuralProperties()
      }
    })
  }

  const handleCreated = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Propriedade rural criada com sucesso!' })
    loadRuralProperties()
  }

  const handleEdited = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Propriedade rural editada com sucesso!' })
    loadRuralProperties()
  }

  const goManageRuralProperty = (id) => {
    closeAllModals()
    history.push(`/propriedades-rurais/gerenciar/${id}`)
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Gerenciar', action: () => goManageRuralProperty(id) },
      { label: 'Editar', action: () => openModalEdit(id) },
      { label: 'Remover', action: () => handleRemove(id) }
    ])
  }

  return (
    <Container page>
      <FlexRow alignItems="center">
        <Title marginBottom={0} flex={1}>
          Propriedades Rurais
        </Title>

        <Button variant="default" onClick={openModalCreate}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {ruralProperties.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openModalView(item.id)}
          >
            <ListItemBox grow={1}>
              <Subtitle>{item.name}</Subtitle>
              <p>{item.address}</p>
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

export default RuralPropertyList;