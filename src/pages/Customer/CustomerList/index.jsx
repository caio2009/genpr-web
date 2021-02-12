import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import Modal from '@components/Modal'
import CreateCustomerForm from '@components/Forms/CreateCustomerForm'
import EditCustomerForm from '@components/Forms/EditCustomerForm'

import api from '@services/api'

const CustomerList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()

  const [customers, setUnitMeasures] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  // create rural property modal status
  const [modalCreate, setModalCreate] = useState(false)
  const [keyCreate, setKeyCreate] = useState(Math.random())

  // edit rural property modal status
  const [modalEdit, setModalEdit] = useState(false)
  const [keyEdit, setKeyEdit] = useState(Math.random())

  const loadUnitMeasures = async () => {
    const res = await api.get('customers')
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
        await api.delete(`customers/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadUnitMeasures()
      }
    })
  }

  const handleCreated = () => {
    setKeyCreate(Math.random())
    addToast({ title: 'Sucesso', description: 'Cliente criada com sucesso!' })
    setModalCreate(false)
    loadUnitMeasures()
  }

  const handleEdited = () => {
    setKeyEdit(Math.random())
    addToast({ title: 'Sucesso', description: 'Cliente editada com sucesso!' })
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
          Clientes
        </Title>

        <Button variant="default" onClick={() => setModalCreate(true)}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {customers.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openEditModal(item.id)}
          >
            <ListItemBox grow={1}>
              <Subtitle>{item.name}</Subtitle>
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
        title="Nova Cliente"
        content={(
          <CreateCustomerForm
            onCreated={handleCreated}
            onCancel={closeCreateModal}
          />
        )}
      />

      <Modal
        key={keyEdit}
        show={modalEdit}
        closeModal={closeEditModal}
        title="Cliente"
        content={(
          <EditCustomerForm
            entityId={selectedId}
            onEdited={handleEdited}
            onCancel={closeEditModal}
          />
        )}
      />
    </Container>
  )
}

export default CustomerList;