import React, { useState, useEffect } from 'react'

import { FiChevronRight, FiX } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItemBox } from '../../../styles/components'
import LongPressListItem from '../../../components/LongPressListItem'
import ActionsBar from '../../../components/ActionsBar'
import Button from '../../../components/Button'

import api from '../../../services/api'

const RuralProperty = () => {
  const [ruralProperties, setRuralProperties] = useState([])

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

  const handleClick = () => {
    if (selected.length === 0) {
      console.log('click')
    }
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

  return (
    <Container page>
      <Title>Propriedades Rurais</Title>

      <List>
        {ruralProperties.map((el, index) => (
          <LongPressListItem
            key={index}
            isSelected={isSelected(index)}
            onLongPress={() => handleSelect(index)}
            customOnClick={handleClick}
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

      <ActionsBar show={actionsBar}>
        <Button variant="error">Excluir</Button>
        <Button variant="info">Gerenciar</Button>
      </ActionsBar>
    </Container>
  )
}

export default RuralProperty;