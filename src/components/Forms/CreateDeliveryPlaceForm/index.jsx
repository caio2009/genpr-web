import React from 'react'
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

const CreateDeliveryPlaceForm = ({ onCreated, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    await api.post('deliveryPlaces', data)

    onCreated()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={register}
        name="description"
        label="Descrição *"
        onChange={(value) => setValue('description', value)}
        error={errors.description}
      />

      <br />

      <FlexRow gap={1}>
        <Button type="submit" variant="primary">
          Salvar
        </Button>

        <Button variant="error" onClick={onCancel}>
          Cancelar
        </Button>
      </FlexRow>
    </form>
  )
}

export default CreateDeliveryPlaceForm