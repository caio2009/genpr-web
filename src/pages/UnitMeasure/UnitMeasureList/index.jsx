import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, List, ListItem, ListItemBox, FlexRow, IconButton } from '@styles/components'
import Button from '@components/Button'
import CreateUnitMeasureForm from '@components/Forms/CreateUnitMeasureForm'
import EditUnitMeasureForm from '@components/Forms/EditUnitMeasureForm'

import api from '@services/api'

const CultivationList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeModal } = useModal()

  const [unitMeasures, setUnitMeasures] = useState([])

  const loadUnitMeasures = async () => {
    const res = await api.get('unitMeasures')
    setUnitMeasures(res.data)
  }

  useEffect(() => {
    loadUnitMeasures()
  }, [])

  const openModalCreate = () => {
    openModal({
      title: 'Nova Unidade de Medida',
      content: (
        <CreateUnitMeasureForm
          onCreated={handleCreated}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalEdit = (id) => {
    openModal({
      title: 'Editar Unidade de Medida',
      content: (
        <EditUnitMeasureForm
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
        await api.delete(`unitMeasures/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadUnitMeasures()
      }
    })
  }

  const handleCreated = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Unidade de medida criada com sucesso!' })
    loadUnitMeasures()
  }

  const handleEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Unidade de medida editada com sucesso!' })
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

        <Button variant="default" onClick={openModalCreate}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {unitMeasures.map((item, index) => (
          <ListItem
            hoverable
            key={index}
            onClick={() => openModalEdit(item.id)}
          >
            <ListItemBox grow={1}>
              <p>{item.name} ({item.abbreviation})</p>
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