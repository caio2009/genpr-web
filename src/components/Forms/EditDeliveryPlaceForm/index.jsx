import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import api from '@services/api'
import errorMessages from '../errorMessages'

import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const schema = yup.object().shape({
  description: yup.string().required(errorMessages.required)
})

const EditDeliveryPlaceForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [deliveryPlace, setDeliveryPlace] = useState(null)

  const loadDeliveryPlace = useCallback(async () => {
    if (id) {
      const res = await api.get(`deliveryPlaces/${id}`)
      setDeliveryPlace(res.data)
    }
  }, [id])

  const onSubmit = async (data) => {
    await api.put(`deliveryPlaces/${id}`, data)

    onEdited()
  }

  useEffect(() => {
    loadDeliveryPlace()
  }, [loadDeliveryPlace, id])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={register}
        name="description"
        label="Descrição *"
        onChange={(value) => setValue('description', value)}
        defaultValue={deliveryPlace?.description}
        error={errors.description}
      />

      <br />

      <FlexRow gap={1}>
        <Button type="submit" variant="warning">
          Salvar
        </Button>

        <Button variant="error" onClick={onCancel}>
          Cancelar
        </Button>
      </FlexRow>
    </form>
  )
}

export default EditDeliveryPlaceForm