import React, { useEffect, useCallback, useState } from 'react'

import api from '@services/api'

import { FiEdit, FiTrash2, FiSettings } from 'react-icons/fi'
import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const RuralPropertyView = ({ entityId: id, onClose, onManageClick, onEditClick, onRemoveClick }) => {
  const [ruralProperty, setRuralProperty] = useState(null)

  const loadRuralProperty = useCallback(async () => {
    if (id) {
      const res = await api.get(`ruralProperties/${id}`)
      setRuralProperty(res.data)
    }
  }, [id])

  useEffect(() => {
    loadRuralProperty()
  }, [loadRuralProperty, id])

  return (
    <div>
      <FlexRow justifyContent="flex-end">
        <Button onClick={onManageClick}>
          <FiSettings />
        </Button>

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
        defaultValue={ruralProperty?.name}
        readOnly
      />

      <Input
        name="address"
        label="Endereço"
        defaultValue={ruralProperty?.address}
        readOnly
      />

      <Input
        name="area"
        label="Área"
        defaultValue={ruralProperty?.area.toFixed(2)}
        readOnly
      />

      <Input
        name="description"
        label="Descrição"
        defaultValue={ruralProperty?.description}
        readOnly
      />

      <br />

      <Button variant="error" onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}

export default RuralPropertyView