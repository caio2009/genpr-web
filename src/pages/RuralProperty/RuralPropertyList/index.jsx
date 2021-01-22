import React, { useState, useEffect } from 'react'
// import { useHistory } from 'react-router-dom'

import { FiChevronRight, FiX } from 'react-icons/fi'
import { Container, Title, Subtitle, List, ListItemBox } from '../../../styles/components'
import LongPressListItem from '../../../components/LongPressListItem'

import api from '../../../services/api'

const RuralProperty = () => {
  // const history = useHistory()

  const [ruralProperties, setRuralProperties] = useState([])

  const [selected, setSelected] = useState([])

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
    </Container>
  )
}

export default RuralProperty;