import React, { useEffect, useCallback, useState } from 'react'

import api from '@services/api'

import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const UnitMeasureView = ({ entityId: id, onClose, onEditClick, onRemoveClick }) => {
  const [unitMeasure, setUnitMeasure] = useState(null)

  const loadUnitMeasure = useCallback(async () => {
    if (id) {
      const res = await api.get(`unit-measures/${id}`)
      setUnitMeasure(res.data)
    }
  }, [id])

  useEffect(() => {
    loadUnitMeasure()
  }, [loadUnitMeasure, id])

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
        defaultValue={unitMeasure?.name}
        readOnly
      />

      <Input
        name="abbreviation"
        label="Abreviação"
        defaultValue={unitMeasure?.abbreviation}
        readOnly
      />

      <br />

      <Button variant="error" onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}

export default UnitMeasureView