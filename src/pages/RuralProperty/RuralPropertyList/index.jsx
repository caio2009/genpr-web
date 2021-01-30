import React, { useState, useEffect } from 'react'
import { useToast } from '../../../hooks/Toast/toast'
import { useConfirmDialog } from '../../../hooks/confirmDialog'
import { useOptionDialog } from '../../../hooks/optionDialog'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItem, ListItemBox, FlexRow, IconButton } from '../../../styles/components'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import CreateRuralPropertyForm from '../../../components/Forms/CreateRuralPropertyForm'
import EditRuralPropertyForm from '../../../components/Forms/EditRuralPropertyForm'

import api from '../../../services/api'

const RuralProperty = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()

  const [ruralProperties, setRuralProperties] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  // create rural property modal status
  const [modalCreate, setModalCreate] = useState(false)
  const [keyCreate, setKeyCreate] = useState(Math.random()) 

  // edit rural property modal status
  const [modalEdit, setModalEdit] = useState(false)

  const loadRuralProperties = async () => {
    const res = await api.get('ruralProperties')
    setRuralProperties(res.data)
  }

  useEffect(() => {
    loadRuralProperties()
  }, [])

  const closeCreateRuralPropertyModal = () => {
    setModalCreate(false)
    setKeyCreate(Math.random())
  }

  const openEditRuralPropertyModal = (id) => {
    setModalEdit(true)
    setSelectedId(id)
  }

  const handleRemove = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`ruralProperties/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadRuralProperties()
      }
    })
  }

  const handleCreated = () => {
    setKeyCreate(Math.random())
    addToast({ title: 'Sucesso', description: 'Propriedade rural criada com sucesso!' })
    setModalCreate(false)
    loadRuralProperties()
  }

  const handleEdited = () => {
    addToast({ title: 'Sucesso', description: 'Propriedade rural editada com sucesso!' })
    setModalEdit(false)
    loadRuralProperties()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Remover', action: () => handleRemove(id) },
      { label: 'Gerenciar', action: () => { console.log('Deu certo') } }
    ])
  }

  return (
    <Container page>
      <FlexRow alignItems="center">
        <Title marginBottom={0} flex={1}>
          Propriedades Rurais
        </Title>

        <Button variant="default" onClick={() => setModalCreate(true)}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {ruralProperties.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openEditRuralPropertyModal(item.id)}
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

      <Modal
        key={keyCreate}
        show={modalCreate}
        closeModal={() => setModalCreate(false)}
        title="Nova Propriedade Rural"
        content={(
          <CreateRuralPropertyForm
            onCreated={handleCreated}
            onCancel={closeCreateRuralPropertyModal}
          />
        )}
      />

      <Modal
        show={modalEdit}
        closeModal={() => setModalEdit(false)}
        title="Propriedade Rural"
        content={(
          <EditRuralPropertyForm
            entityId={selectedId}
            onEdited={handleEdited}
            onCancel={() => setModalEdit(false)}
          />
        )}
      />
    </Container>
  )
}

export default RuralProperty;