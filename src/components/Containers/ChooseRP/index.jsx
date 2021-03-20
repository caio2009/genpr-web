import React, { useEffect, useState } from 'react'

import api from '@services/api'

import { Container, Title } from '@styles/components'
import { OptionsContainer, Option } from './styles'

const ChooseRP = ({ description, onChange }) => {
  const [ruralProperties, setRuralProperties] = useState([])

  const loadRuralProperties = async () => {
    const res = await api.get('rural-properties')
    setRuralProperties(res.data)
  }

  useEffect(() => {
    loadRuralProperties()
  }, [])

  const handleClick = (id) => {
    onChange(id)
  }
  
  return (
    <Container page>
      <Title>Escolher Propriedade Rural</Title>

      {description && <p>{description}</p>}

      <OptionsContainer>
        {ruralProperties.map((option, index) => (
          <Option key={index} onClick={() => handleClick(option.id)}>
            {option.name}
          </Option>
        ))}
      </OptionsContainer>
    </Container>
  )
}

export default ChooseRP