import React, { useEffect, useCallback, useState } from 'react'

import api from '@services/api'
import { format } from 'date-fns'

import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const ClassificationView = ({ entityId: id, onClose, onEditClick, onRemoveClick }) => {
  const [harvest, setHarvest] = useState(null)

  const loadHarvest = useCallback(async () => {
    if (id) {
      const res = await api.get(`harvests/${id}?_expand=ruralProperty&_expand=field&_expand=cultivation&_expand=classification&_expand=unitMeasure`)
      setHarvest(res.data)
    }
  }, [id])

  useEffect(() => {
    loadHarvest()
  }, [loadHarvest, id])

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
        name="ruralPropertyName"
        label="Propriedade rural"
        defaultValue={harvest?.ruralProperty.name}
        readOnly
      />

      <Input
        name="fieldName"
        label="Talhão"
        defaultValue={harvest?.field.name}
        readOnly
      />

      <Input
        name="cultivation"
        label="Cultura"
        defaultValue={harvest?.cultivation.name}
        readOnly
      />

      <Input
        name="classificationName"
        label="Classificação"
        defaultValue={harvest?.classification.name}
        readOnly
      />

      <Input
        name="unitMeasureName"
        label="Unidade de Medida"
        defaultValue={harvest?.unitMeasure.name}
        readOnly
      />

      <Input
        name="quantity"
        label="Quantidade"
        defaultValue={harvest?.quantity}
        readOnly
      />

      <Input
        name="registerDate"
        label="Data de registro"
        defaultValue={harvest?.registerDate && format(new Date(harvest?.registerDate), 'dd/MM/yyyy')}
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