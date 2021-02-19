import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import api from '@services/api'
import { format } from 'date-fns'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, FlexRow, List, ListEmpty, ListItem, ListItemBox, IconButton, Subtitle } from '@styles/components'
import { FieldInfo, InfoField } from './styles'
import Button from '@components/Button'
import EditFieldForm from '@components/Forms/EditFieldForm'
import CreateProductionForm from '@components/Forms/CreateProductionForm'
import EditProductionForm from '@components/Forms/EditProductionForm'

const ManageRP = () => {
  const { id } = useParams()
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeModal } = useModal()

  const [field, setField] = useState(null)
  const [productions, setProductions] = useState([])

  const loadField = useCallback(async () => {
    const res = await api.get(`fields/${id}?_expand=ruralProperty&_expand=cultivation`)
    setField({
      ...res.data,
      cultivation: {
        id: res.data.cultivation.id,
        name: `${res.data.cultivation.name} ${res.data.cultivation.variety}`
      }
    })
  }, [id])

  const loadProductions = useCallback(async () => {
    const res = await api.get(`fields/${id}/productions?_expand=classification&_expand=unitMeasure`)
    setProductions(res.data)
  }, [id])

  useEffect(() => {
    loadField()
    loadProductions()
  }, [loadField, loadProductions])

  const openModalEditField = () => {
    openModal({
      title: 'Editar Talhão',
      content: (
        <EditFieldForm
          entityId={id}
          onEdited={handleFieldEdited}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalCreateProduction = () => {
    openModal({
      title: 'Nova Produção',
      content: (
        <CreateProductionForm
          ruralProperty={{ id: field?.ruralProperty.id, name: field?.ruralProperty.name || '' }}
          field={{ id: field?.id, name: field?.name || '' }}
          cultivation={{ id: field?.cultivation.id, name: field?.cultivation.name }}
          onCreated={handleProductionCreated}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalEditProduction = (id) => {
    openModal({
      title: 'Editar Produção',
      content: (
        <EditProductionForm
          entityId={id}
          onEdited={handleProductionEdited}
          onCancel={closeModal}
        />
      )
    })
  }

  const handleFieldEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Talhão editado com sucesso!' })
    loadField()
  }

  const handleRemoveProduction = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`productions/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadProductions()
      }
    })
  }

  const handleProductionCreated = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Produção criada com sucesso!' })
    loadProductions()
  }

  const handleProductionEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Produção editada com sucesso!' })
    loadProductions()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Remover', action: () => handleRemoveProduction(id) }
    ])
  }

  return (
    <Container page>
      <Title>
        Gerenciar Talhão
      </Title>

      <FieldInfo>
        <FlexRow>
          <InfoField style={{ flex: 1 }}>
            <h4>Nome</h4>
            <p className="no-break-line">{field?.name}</p>
          </InfoField>

          <InfoField style={{ flex: 1 }}>
            <h4>Área</h4>
            {field?.area ?
              <p>{field.area} ha</p> :
              <p><i>Não informado</i></p>}
          </InfoField>
        </FlexRow>

        <FlexRow>
          <InfoField style={{ flex: 1 }}>
            <h4>Cultura</h4>
            <p>{field?.cultivation.name} {field?.cultivation.variety}</p>
          </InfoField>

          <InfoField style={{ flex: 1 }}>
            <h4>Data de abertura</h4>
            <p>{field?.openingDate && format(new Date(field.openingDate), 'dd/MM/yyyy')}</p>
          </InfoField>
        </FlexRow>

        <InfoField>
          <h4>Propriedade Rural</h4>
          <p>{field?.ruralProperty.name}</p>
        </InfoField>

        <Button variant="warning" full={window.screen.width <= 375} onClick={openModalEditField}>
          Editar Informações
        </Button>
      </FieldInfo>

      <FlexRow>
        <Title marginBottom={0} style={{ flex: 1 }}>
          Produções
        </Title>

        <Button onClick={openModalCreateProduction}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {
          productions.length ? productions.map((item, index) => (
            <ListItem
              hoverable
              key={index}
              onClick={() => openModalEditProduction(item.id)}
            >
              <ListItemBox grow={1}>
                <Subtitle>{item.classification.name}</Subtitle>
                <p>Quantidade: {item.quantity} {item.unitMeasure.abbreviation}</p>
                {item.registerDate && <p>Data de registro: {format(new Date(item.registerDate), 'dd/MM/yyyy')}</p>}
              </ListItemBox>

              <ListItemBox>
                <IconButton onClick={(e) => handleOpenOptionDialog(e, item.id)}>
                  <FiMoreVertical size={24} />
                </IconButton>
              </ListItemBox>
            </ListItem>
          )) : (
              <ListEmpty>
                <i>Nenhuma produção cadastrada.</i>
              </ListEmpty>
            )
        }
      </List>
    </Container>
  )
}

export default ManageRP