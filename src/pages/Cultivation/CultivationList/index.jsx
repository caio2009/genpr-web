import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItem, ListItemBox, FlexRow, IconButton, AvatarImg } from '@styles/components'
import Button from '@components/Button'
import Modal from '@components/Modal'
import CreateCultivationForm from '@components/Forms/CreateCultivationForm'
import EditCultivationForm from '@components/Forms/EditCultivationForm'

import api from '@services/api'

const CultivationList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()

  const [cultivations, setCultivations] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  // create rural property modal status
  const [modalCreate, setModalCreate] = useState(false)
  const [keyCreate, setKeyCreate] = useState(Math.random())

  // edit rural property modal status
  const [modalEdit, setModalEdit] = useState(false)
  const [keyEdit, setKeyEdit] = useState(Math.random())

  const loadCultivations = async () => {
    const res = await api.get('cultivations')
    setCultivations(res.data)
  }

  useEffect(() => {
    loadCultivations()
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
        await api.delete(`cultivations/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadCultivations()
      }
    })
  }

  const handleCreated = () => {
    setKeyCreate(Math.random())
    addToast({ title: 'Sucesso', description: 'Cultura criada com sucesso!' })
    setModalCreate(false)
    loadCultivations()
  }

  const handleEdited = () => {
    setKeyEdit(Math.random())
    addToast({ title: 'Sucesso', description: 'Cultura editada com sucesso!' })
    setModalEdit(false)
    loadCultivations()
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
          Culturas
        </Title>

        <Button variant="default" onClick={() => setModalCreate(true)}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {cultivations.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openEditModal(item.id)}
          >
            <ListItemBox style={{marginRight: 16}}>
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

      <Modal
        key={keyCreate}
        show={modalCreate}
        closeModal={closeCreateModal}
        title="Nova Cultura"
        content={(
          <CreateCultivationForm
            onCreated={handleCreated}
            onCancel={closeCreateModal}
          />
        )}
      />

      <Modal
        key={keyEdit}
        show={modalEdit}
        closeModal={closeEditModal}
        title="Cultura"
        content={(
          <EditCultivationForm
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