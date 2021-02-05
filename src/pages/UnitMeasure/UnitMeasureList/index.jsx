import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import Modal from '@components/Modal'
import CreateUnitMeasureForm from '@components/Forms/CreateUnitMeasureForm'
import EditUnitMeasureForm from '@components/Forms/EditUnitMeasureForm'

import api from '@services/api'

const CultivationList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()

  const [unitMeasures, setUnitMeasures] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  // create rural property modal status
  const [modalCreate, setModalCreate] = useState(false)
  const [keyCreate, setKeyCreate] = useState(Math.random())

  // edit rural property modal status
  const [modalEdit, setModalEdit] = useState(false)
  const [keyEdit, setKeyEdit] = useState(Math.random())

  const loadUnitMeasures = async () => {
    const res = await api.get('unitMeasures')
    setUnitMeasures(res.data)
  }

  useEffect(() => {
    loadUnitMeasures()
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
        await api.delete(`unitMeasures/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadUnitMeasures()
      }
    })
  }

  const handleCreated = () => {
    setKeyCreate(Math.random())
    addToast({ title: 'Sucesso', description: 'Unidade de medida criada com sucesso!' })
    setModalCreate(false)
    loadUnitMeasures()
  }

  const handleEdited = () => {
    setKeyEdit(Math.random())
    addToast({ title: 'Sucesso', description: 'Unidade de medida editada com sucesso!' })
    setModalEdit(false)
    loadUnitMeasures()
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
          Unidades de Medida
        </Title>

        <Button variant="default" onClick={() => setModalCreate(true)}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {unitMeasures.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openEditModal(item.id)}
          >
            <ListItemBox grow={1}>
              <Subtitle>{item.name} ({item.abbreviation})</Subtitle>
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
        title="Nova Unidade de Medida"
        content={(
          <CreateUnitMeasureForm
            onCreated={handleCreated}
            onCancel={closeCreateModal}
          />
        )}
      />

      <Modal
        key={keyEdit}
        show={modalEdit}
        closeModal={closeEditModal}
        title="Unidade de Medida"
        content={(
          <EditUnitMeasureForm
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