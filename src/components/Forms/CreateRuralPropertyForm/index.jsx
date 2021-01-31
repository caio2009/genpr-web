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
  name: yup.string().required(errorMessages.required),
  address: yup.string().required(errorMessages.required),
  area: yup.number(),
  description: yup.string()
})

const CreateRuralPropertyForm = ({ onCreated, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const formatData = (data) => ({
    ...data,
    area: Number(data.area)
  })

  const onSubmit = async (data) => {
    data = formatData(data)

    await api.post('ruralProperties', data)

    onCreated()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={register}
        name="name"
        label="Nome *"
        onChange={(value) => setValue('name', value)}
        error={errors.name}
      />

      <Input
        ref={register}
        name="address"
        label="Endereço *"
        onChange={(value) => setValue('address', value)}
        error={errors.address}
      />

      <Input
        ref={register}
        name="area"
        label="Área"
        defaultValue="0"
        inputMode="numeric"
        onChange={(value) => setValue('area', value)}
      />

      <Input
        ref={register}
        name="description"
        label="Descrição"
        onChange={(value) => setValue('description', value)}
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

export default CreateRuralPropertyForm