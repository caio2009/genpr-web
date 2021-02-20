import React, { useEffect, useCallback, useState } from 'react'

import api from '@services/api'

import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const ClassificationView = ({ entityId: id, onClose, onEditClick, onRemoveClick }) => {
  const [classification, setClassification] = useState(null)

  const loadClassification = useCallback(async () => {
    if (id) {
      const res = await api.get(`classifications/${id}`)
      setClassification(res.data)
    }
  }, [id])

  useEffect(() => {
    loadClassification()
  }, [loadClassification, id])

  return (
    <div>
      <FlexRow justifyContent="flex-end">
        <Button variant="warning" onClick={onEditClick}>
          <FiEdit />
        </Button>

        <Button variant="error" onClick={onRemoveClick}>
          <FiTrash2 />
        </Button>
      </FlexRow>
      
      <Input
        name="name"
        label="Nome"
        defaultValue={classification?.name}
        readOnly
      />

      <br />

      <Button variant="error" onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}

export default ClassificationView