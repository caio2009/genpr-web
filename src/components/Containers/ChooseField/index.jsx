import React, { useEffect, useState } from 'react'

import api from '@services/api'

import { Container, Title } from '@styles/components'
import { OptionsContainer, Option } from './styles'

const ChooseField = ({ ruralPropertyId, description, onChange }) => {
  const [fields, setFields] = useState([])

  const loadFields = async () => {
    if (ruralPropertyId) {
      const res = await api.get(`ruralProperties/${ruralPropertyId}/fields`)
      setFields(res.data)
    }
  }

  useEffect(() => {
    loadFields()
  }, [])

  const handleClick = (id) => {
    onChange(id)
  }
  
  return (
    <Container page>
      <Title>Escolher Talhão</Title>

      {description && <p>{description}</p>}

      <OptionsContainer>
        {fields.map((option, index) => (
          <Option key={index} onClick={() => handleClick(option.id)}>
            {option.name}
          </Option>
        ))}
      </OptionsContainer>
    </Container>
  )
}

export default ChooseField