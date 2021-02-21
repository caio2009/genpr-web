import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'

import api from '@services/api'
import { format } from 'date-fns'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, FlexRow, List, ListEmpty, ListItem, ListItemBox, IconButton, Subtitle } from '@styles/components'
import { RuralPropertyInfo, InfoField } from './styles'
import Button from '@components/Button'
import EditRuralPropertyForm from '@components/Forms/EditRuralPropertyForm'
import CreateFieldForm from '@components/Forms/CreateFieldForm'
import FieldView from '@components/Containers/ModalViews/FieldView'
import EditFieldForm from '@components/Forms/EditFieldForm'

const ManageRP = () => {
  const { id } = useParams()
  const history = useHistory()
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeModal } = useModal()

  const [ruralProperty, setRuralProperty] = useState({})
  const [fields, setFields] = useState([])
  const [infoDisplay, setInfoDisplay] = useState(false)

  const loadRuralProperty = useCallback(async () => {
    const res = await api.get(`ruralProperties/${id}`)
    setRuralProperty(res.data)
  }, [id])

  const loadFields = useCallback(async () => {
    const res = await api.get(`ruralProperties/${id}/fields?_expand=cultivation`)
    setFields(res.data)
  }, [id])

  useEffect(() => {
    loadRuralProperty()
    loadFields()
  }, [loadRuralProperty, loadFields])

  const goManageField = (id) => {
    closeModal()
    history.push(`/talhoes/gerenciar/${id}`)
  }

  const openModalEditRuralProperty = () => {
    openModal({
      title: 'Editar Propriedade Rural',
      content: (
        <EditRuralPropertyForm
          entityId={id}
          onEdited={handleRuralPropertyEdited}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalCreateField = () => {
    openModal({
      title: 'Novo Talhão',
      content: (
        <CreateFieldForm
          ruralProperty={{ id: ruralProperty.id, name: ruralProperty.name || '' }}
          onCreated={handleFieldCreated}
          onCancel={closeModal}
        />
      )
    })
  }

  const openModalViewField = (id) => {
    openModal({
      title: 'Talhão',
      content: (
        <FieldView 
          entityId={id}
          onClose={closeModal}
          onManageClick={() => goManageField(id)}
          onEditClick={() => openModalEditField(id)}
          onRemoveClick={() => handleRemoveField(id)}
        />
      )
    })
  }

  const openModalEditField = (id) => {
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

  const handleRuralPropertyEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Propriedade rural editada com sucesso!' })
    loadRuralProperty()
  }

  const handleRemoveField = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`fields/${id}`)

        closeModal()
        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadFields()
      }
    })
  }

  const handleFieldCreated = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Talhão criado com sucesso!' })
    loadFields()
  }

  const handleFieldEdited = () => {
    closeModal()
    addToast({ title: 'Sucesso', description: 'Talhão editado com sucesso!' })
    loadFields()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Gerenciar', action: () => goManageField(id)},
      { label: 'Editar', action: () => openModalEditField(id) },
      { label: 'Remover', action: () => handleRemoveField(id) }
    ])
  }

  return (
    <Container page>
      <Title>
        Gerenciar Propriedade Rural
      </Title>

      <Subtitle>
        Informações da Propriedade Rural
      </Subtitle>

      <RuralPropertyInfo>
        <div style={{ display: infoDisplay ? 'block' : 'none', marginBottom: '.25rem' }}>
          <FlexRow>
            <InfoField style={{ flex: 1 }}>
              <h4>Nome</h4>
              <p className="no-break-line">{ruralProperty.name}</p>
            </InfoField>

            <InfoField style={{ flex: 1 }}>
              <h4>Endereço</h4>
              <p className="no-break-line">{ruralProperty.address}</p>
            </InfoField>

            <InfoField style={{ flex: 1 }}>
              <h4>Área</h4>
              {ruralProperty.area ?
                <p>{ruralProperty.area} ha</p> :
                <p><i>Não informado</i></p>}
            </InfoField>
          </FlexRow>

          <InfoField>
            <h4>Descrição</h4>
            {ruralProperty.description ?
              <p>{ruralProperty.description}</p> :
              <p><i>Sem descrição</i></p>}
          </InfoField>

          <Button variant="warning" full onClick={openModalEditRuralProperty}>
            Editar Informações
          </Button>
        </div>

        <Button full onClick={() => setInfoDisplay(!infoDisplay)}>
          {infoDisplay ? 'Esconder' : 'Mostrar'}
        </Button>
      </RuralPropertyInfo>

      <FlexRow>
        <Title marginBottom={0} style={{ flex: 1 }}>
          Talhões
        </Title>

        <Button onClick={openModalCreateField}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {
          fields.length ? fields.map((item, index) => (
            <ListItem
              hoverable
              key={index}
              onClick={() => openModalViewField(item.id)}
            >
              <ListItemBox grow={1}>
                <Subtitle>{item.name}</Subtitle>
                <p>Cultura: {item.cultivation.name} {item.cultivation.variety}</p>
                <p>Data de abertura: {format(new Date(item.openingDate), 'dd/MM/yyyy')}</p>
              </ListItemBox>

              <ListItemBox>
                <IconButton onClick={(e) => handleOpenOptionDialog(e, item.id)}>
                  <FiMoreVertical size={24} />
                </IconButton>
              </ListItemBox>
            </ListItem>
          )) : (
              <ListEmpty>
                <i>Nenhum talhão cadastrado.</i>
              </ListEmpty>
            )
        }
      </List>
    </Container>
  )
}

export default ManageRP