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
  variety: yup.string().required(errorMessages.required),
  imageUrl: yup.string().url()
})

const CreateCultivationForm = ({ onCreated, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    await api.post('cultivations', data)

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
        name="variety"
        label="Variedade *"
        onChange={(value) => setValue('variety', value)}
        error={errors.variety}
      />

      <Input
        ref={register}
        name="imageUrl"
        label="URL da imagem"
        onChange={(value) => setValue('imageUrl', value)}
        error={errors.imageUrl}
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

export default CreateCultivationForm