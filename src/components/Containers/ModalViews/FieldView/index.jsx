import React, { useEffect, useCallback, useState } from 'react'

import api from '@services/api'
import { format } from 'date-fns'

import { FiEdit, FiTrash2, FiSettings } from 'react-icons/fi'
import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const FieldView = ({ entityId: id, onClose, onManageClick, onEditClick, onRemoveClick }) => {
  const [field, setField] = useState(null)

  const loadField = useCallback(async () => {
    if (id) {
      const res = await api.get(`fields/${id}?_expand=ruralProperty&_expand=cultivation`)
      setField(res.data)
    }
  }, [id])

  useEffect(() => {
    loadField()
  }, [loadField, id])

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
        name="ruralPropertyName"
        label="Propriedade Rural"
        defaultValue={field?.ruralProperty.name}
        readOnly
      />

      <Input
        name="name"
        label="Nome"
        defaultValue={field?.name}
        readOnly
      />

      <Input
        name="cultivationName"
        label="Cultura"
        defaultValue={field?.cultivation.name}
        readOnly
      />

      <Input
        name="area"
        label="Área"
        defaultValue={field?.area.toFixed(2)}
        readOnly
      />

      <Input
        name="openingDate"
        label="Data de abertura"
        defaultValue={field?.openingDate && format(new Date(field?.openingDate), 'dd/MM/yyyy')}
        readOnly
      />

      <br />

      <Button variant="error" onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}

export default FieldView