import React, { useEffect, useCallback, useState } from 'react'

import api from '@services/api'

import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const DeliveryPlaceView = ({ entityId: id, onClose, onEditClick, onRemoveClick }) => {
  const [deliveryPlace, setDeliveryPlace] = useState(null)

  const loadDeliveryPlace = useCallback(async () => {
    if (id) {
      const res = await api.get(`deliveryPlaces/${id}`)
      setDeliveryPlace(res.data)
    }
  }, [id])

  useEffect(() => {
    loadDeliveryPlace()
  }, [loadDeliveryPlace, id])

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
        label="Descrição"
        defaultValue={deliveryPlace?.description}
        readOnly
      />

      <br />

      <Button variant="error" onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}

export default DeliveryPlaceView