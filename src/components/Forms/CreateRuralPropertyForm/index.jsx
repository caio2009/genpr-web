import React from 'react'
import { useForm } from 'react-hook-form'

import api from '../../../services/api'

import { FlexRow } from '../../../styles/components'
import Input from '../../Input'
import Button from '../../Button'

const CreateRuralPropertyForm = ({ onCreated, onCancel }) => {
  const { register, setValue, handleSubmit } = useForm()

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
      />

      <Input
        ref={register}
        name="address"
        label="Endereço *"
        onChange={(value) => setValue('address', value)}
      />

      <Input
        ref={register}
        name="area"
        label="Área"
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