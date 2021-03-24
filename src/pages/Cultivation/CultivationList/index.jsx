import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItem, ListItemBox, FlexRow, IconButton, AvatarImg } from '@styles/components'
import Button from '@components/Button'
import CreateCultivationForm from '@components/Forms/CreateCultivationForm'
import EditCultivationForm from '@components/Forms/EditCultivationForm'
import CultivationView from '@components/Containers/ModalViews/CultivationView'

import api from '@services/api'

const CultivationList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeAllModals } = useModal()

  const [cultivations, setCultivations] = useState([])

  const loadCultivations = async () => {
    const res = await api.get('cultivations')
    setCultivations(res.data)
  }

  useEffect(() => {
    loadCultivations()
  }, [])

  const openModalCreate = () => {
    openModal({
      id: 'createCultivation',
      title: 'Nova Cultura',
      content: (
        <CreateCultivationForm
          onCreated={handleCreated}
          onCancel={closeAllModals}
        />
      )
    })
  }

  const openModalView = (id) => {
    openModal({
      id: 'viewCultivation',
      title: 'Cultura',
      content: (
        <CultivationView 
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
      id: 'editCultivation',
      title: 'Editar Cultura',
      content: (
        <EditCultivationForm
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
        await api.delete(`cultivations/${id}`)

        closeAllModals()
        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadCultivations()
      }
    })
  }

  const handleCreated = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Cultura criada com sucesso!' })
    loadCultivations()
  }

  const handleEdited = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Cultura editada com sucesso!' })
    loadCultivations()
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
          Culturas
        </Title>

        <Button variant="default" onClick={openModalCreate}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {cultivations.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openModalView(item.id)}
          >
            <ListItemBox style={{ marginRight: 16 }}>
              {item.imageUrl && <AvatarImg src={item.imageUrl} />}
            </ListItemBox>

            <ListItemBox grow={1}>
              <Subtitle>{item.name}</Subtitle>
              <p>{item.variety}</p>
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