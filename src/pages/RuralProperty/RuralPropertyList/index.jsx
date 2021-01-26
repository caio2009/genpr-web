import React, { useState, useEffect } from 'react'
import useModal from '../../../hooks/modal'

import { FiChevronRight, FiX } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItemBox, FlexRow, ActionButton } from '../../../styles/components'
import LongPressListItem from '../../../components/LongPressListItem'
import ActionsBar from '../../../components/ActionsBar'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import CreateRuralPropertyForm from '../../../components/Forms/CreateRuralPropertyForm'
import EditRuralPropertyForm from '../../../components/Forms/EditRuralPropertyForm'

import api from '../../../services/api'

const RuralProperty = () => {
  const { isShowing, registerModal, toggleModal } = useModal();

  const [ruralProperties, setRuralProperties] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const [selected, setSelected] = useState([])
  const [actionsBar, setActionsBar] = useState(false)

  const loadRuralProperties = async () => {
    const res = await api.get('ruralProperties')
    setRuralProperties(res.data)
  }

  const handleSelect = (value) => {
    const currIndex = selected.indexOf(value)
    const newSelected = [...selected]

    if (currIndex === -1) {
      newSelected.push(value)
    } else {
      newSelected.splice(currIndex, 1)
    }

    setSelected(newSelected)
  }

  const isSelected = (value) => {
    return selected.indexOf(value) !== -1
  }

  const handleListItemClick = (id) => {
    if (selected.length === 0) {
      setSelectedId(id)
      toggleModal('editRuralProperty')
    }
  }

  const refresh = () => {
    toggleModal('createRuralProperty', false)
    toggleModal('editRuralProperty', false)
    loadRuralProperties()
  }

  useEffect(() => {
    loadRuralProperties()
  }, [])

  useEffect(() => {
    if (selected.length) {
      setActionsBar(true)
    } else {
      setActionsBar(false)
    }
  }, [selected])

  useEffect(() => {
    registerModal(['createRuralProperty', 'editRuralProperty'])
    // eslint-disable-next-line
  }, [])

  return (
    <Container page>
      <FlexRow alignItems="center">
        <Title marginBottom={0} flex={1}>
          Propriedades Rurais
        </Title>

        <Button variant="default" onClick={() => toggleModal('createRuralProperty')}>
          Criar
        </Button>
      </FlexRow>

      <br />

      <List>
        {ruralProperties.map((el, index) => (
          <LongPressListItem
            key={index}
            isSelected={isSelected(index)}
            onLongPress={() => handleSelect(index)}
            customOnClick={() => handleListItemClick(el.id)}
          >
            <ListItemBox grow={1}>
              <Subtitle>{el.name}</Subtitle>
              <p>{el.address}</p>
              <p>{el.description}</p>
            </ListItemBox>

            <ListItemBox>
              {
                isSelected(index) ?
                  <FiX size={24} onClick={() => handleSelect(index)} /> :
                  <FiChevronRight size={24} />
              }
            </ListItemBox>
          </LongPressListItem>
        ))}
      </List>

      <Modal
        isShowing={isShowing('createRuralProperty')}
        hide={() => toggleModal('createRuralProperty')}
        title="Nova Propriedade Rural"
        content={(
          <CreateRuralPropertyForm 
            onCreated={refresh} 
            onCancel={() => toggleModal('editRuralProperty')} 
          />
        )}
      />

      <Modal
        isShowing={isShowing('editRuralProperty')}
        hide={() => toggleModal('editRuralProperty')}
        title="Propriedade Rural"
        content={(
          <EditRuralPropertyForm 
            entityId={selectedId} 
            onEdited={refresh} 
            onCancel={() => toggleModal('editRuralProperty')} 
          />
        )}
      />

      <ActionsBar show={actionsBar}>
        <ActionButton color="red">Excluir</ActionButton>
        <ActionButton color="blue">Gerenciar</ActionButton>
      </ActionsBar>
    </Container>
  )
}

export default RuralProperty;