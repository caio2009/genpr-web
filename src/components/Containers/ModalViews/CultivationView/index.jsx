import React, { useEffect, useCallback, useState } from 'react'

import api from '@services/api'

import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const CultivationView = ({ entityId: id, onClose, onEditClick, onRemoveClick }) => {
  const [cultivation, setCultivation] = useState(null)

  const loadCultivation = useCallback(async () => {
    if (id) {
      const res = await api.get(`cultivations/${id}`)
      setCultivation(res.data)
    }
  }, [id])

  useEffect(() => {
    loadCultivation()
  }, [loadCultivation, id])

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
        defaultValue={cultivation?.name}
        readOnly
      />

      <Input
        name="variety"
        label="Variedade"
        defaultValue={cultivation?.variety}
        readOnly
      />

      <Input
        name="imageUrl"
        label="URL da imagem"
        defaultValue={cultivation?.imageUrl}
        readOnly
      />

      <br />

      <Button variant="error" onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}

export default CultivationView