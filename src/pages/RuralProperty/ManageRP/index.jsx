import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'

import api from '@services/api'
import { format } from 'date-fns'

import { FiMoreVertical } from 'react-icons/fi'
import { Container, Title, FlexRow, List, ListEmpty, ListItem, ListItemBox, IconButton, Subtitle } from '@styles/components'
import { RuralPropertyInfo, InfoField } from './styles'
import Button from '@components/Button'
import Modal from '@components/Modal'
import EditRuralPropertyForm from '@components/Forms/EditRuralPropertyForm'
import CreateFieldForm from '@components/Forms/CreateFieldForm'
import EditFieldForm from '@components/Forms/EditFieldForm'

const ManageRP = () => {
  const { id } = useParams()
  const history = useHistory()
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()

  const [ruralProperty, setRuralProperty] = useState({})
  const [fields, setFields] = useState([])
  const [selectedFieldId, setSelectedFieldId] = useState(null)

  // edit rural property modal status
  const [modalEditRuralProperty, setModalEditRuralProperty] = useState(false)
  const [keyEditRuralProperty, setKeyEditRuralProperty] = useState(Math.random())

  // create field modal status
  const [modalCreateField, setModalCreateField] = useState(false)
  const [keyCreateField, setKeyCreateField] = useState(Math.random())

  // edit field modal status
  const [modalEditField, setModalEditField] = useState(false)
  const [keyEditField, setKeyEditField] = useState(Math.random())

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

  const closeEditRuralPropertyModal = () => {
    setModalEditRuralProperty(false)
    setKeyEditRuralProperty(Math.random())
  }

  const closeCreateFieldModal = () => {
    setModalCreateField(false)
    setKeyCreateField(Math.random())
  }

  const closeEditFieldModal = () => {
    setModalEditField(false)
    setKeyEditField(Math.random())
  }

  const goManageField = (id) => {
    history.push(`/talhoes/gerenciar/${id}`)
  }

  const handleRuralPropertyEdited = () => {
    setKeyEditRuralProperty(Math.random())
    addToast({ title: 'Sucesso', description: 'Propriedade rural editada com sucesso!' })
    setModalEditRuralProperty(false)
    loadRuralProperty()
  }

  const handleRemoveField = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`fields/${id}`)

        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadFields()
      }
    })
  }

  const handleFieldCreated = () => {
    setKeyCreateField(Math.random())
    addToast({ title: 'Sucesso', description: 'Talhão criado com sucesso!' })
    setModalCreateField(false)
    loadFields()
  }

  const handleFieldEdited = () => {
    setKeyEditField(Math.random())
    addToast({ title: 'Sucesso', description: 'Talhão editado com sucesso!' })
    setModalEditField(false)
    loadFields()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Remover', action: () => handleRemoveField(id) }
    ])
  }

  return (
    <Container page>
      <Title>
        Gerenciar Propriedade Rural
      </Title>

      <RuralPropertyInfo>
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

        <Button variant="warning" full={window.screen.width <= 375} onClick={() => setModalEditRuralProperty(true)}>
          Editar Informações
        </Button>
      </RuralPropertyInfo>

      <FlexRow>
        <Title marginBottom={0} style={{ flex: 1 }}>
          Talhões
        </Title>

        <Button onClick={() => setModalCreateField(true)}>
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
              onClick={() => goManageField(item.id)}
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

      <Modal
        key={keyEditRuralProperty}
        show={modalEditRuralProperty}
        closeModal={closeEditRuralPropertyModal}
        title="Propriedade Rural"
        content={(
          <EditRuralPropertyForm
            entityId={id}
            onEdited={handleRuralPropertyEdited}
            onCancel={closeEditRuralPropertyModal}
          />
        )}
      />

      <Modal
        key={keyCreateField}
        show={modalCreateField}
        closeModal={closeCreateFieldModal}
        title="Novo Talhão"
        content={(
          <CreateFieldForm
            ruralProperty={{ id: ruralProperty.id, name: ruralProperty.name || '' }}
            onCreated={handleFieldCreated}
            onCancel={closeCreateFieldModal}
          />
        )}
      />

      <Modal
        key={keyEditField}
        show={modalEditField}
        closeModal={closeEditFieldModal}
        title="Talhão"
        content={(
          <EditFieldForm
            entityId={selectedFieldId}
            onEdited={handleFieldEdited}
            onCancel={closeEditFieldModal}
          />
        )}
      />
    </Container>
  )
}

export default ManageRP