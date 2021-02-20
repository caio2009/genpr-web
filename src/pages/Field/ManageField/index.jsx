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
import CreateHarvestForm from '@components/Forms/CreateHarvestForm'
import EditHarvestForm from '@components/Forms/EditHarvestForm'
import HarvestView from '@components/Containers/ModalViews/HarvestView'

const ManageRP = () => {
  const { id } = useParams()
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeModal } = useModal()

  const [field, setField] = useState(null)
  const [harvests, setHarvests] = useState([])
  const [infoDisplay, setInfoDisplay] = useState(false)

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

  const loadHarvests = useCallback(async () => {
    const res = await api.get(`fields/${id}/harvests?_expand=classification&_expand=unitMeasure`)
    setHarvests(res.data)
  }, [id])

  useEffect(() => {
    loadField()
    loadHarvests()
  }, [loadField, loadHarvests])

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

  const openModalCreateHarvest = () => {
    openModal({
      title: 'Nova Colheita',
      content: (
        <CreateHarvestForm
          ruralProperty={{ id: field?.ruralProperty.id, name: field?.ruralProperty.name || '' }}
          field={{ id: field?.id, name: field?.name || '' }}
          cultivation={{ id: field?.cultivation.id, name: field?.cultivation.name }}
          onCreated={handleHarvestCreated}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalViewHarvest = (id) => {
    openModal({
      title: 'Colheita',
      content: (
        <HarvestView 
          entityId={id}
          onClose={closeModal}
          onEditClick={() => openModalEditHarvest(id)}
          onRemoveClick={() => handleRemoveHarvest(id)}
        />
      )
    })
  }

  const openModalEditHarvest = (id) => {
    openModal({
      title: 'Editar Colheita',
      content: (
        <EditHarvestForm
          entityId={id}
          onEdited={handleHarvestEdited}
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

  const handleRemoveHarvest = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`harvests/${id}`)

        closeModal()
        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadHarvests()
      }
    })
  }

  const handleHarvestCreated = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Colheita criada com sucesso!' })
    loadHarvests()
  }

  const handleHarvestEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Colheita editada com sucesso!' })
    loadHarvests()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Editar', action: () => openModalEditHarvest(id) },
      { label: 'Remover', action: () => handleRemoveHarvest(id) }
    ])
  }

  return (
    <Container page>
      <Title>
        Gerenciar Talhão
      </Title>

      <FieldInfo>
        <div style={{ display: infoDisplay ? 'block' : 'none', marginBottom: '.25rem' }}>
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

          <Button variant="warning" full onClick={openModalEditField}>
            Editar Informações
          </Button>
        </div>

        <Button full onClick={() => setInfoDisplay(!infoDisplay)}>
          {infoDisplay ? 'Esconder' : 'Informações do Talhão'}
        </Button>
      </FieldInfo>

      <FlexRow>
        <Title marginBottom={0} style={{ flex: 1 }}>
          Colheitas
        </Title>

        <Button onClick={openModalCreateHarvest}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {
          harvests.length ? harvests.map((item, index) => (
            <ListItem
              hoverable
              key={index}
              onClick={() => openModalViewHarvest(item.id)}
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
                <i>Nenhuma Colheita cadastrada.</i>
              </ListEmpty>
            )
        }
      </List>
    </Container>
  )
}

export default ManageRP