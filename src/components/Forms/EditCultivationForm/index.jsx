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
  name: yup.string().required(errorMessages.required),
  variety: yup.string().required(errorMessages.required),
  imageUrl: yup.string().url()
})

const EditCultivationForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [cultivation, setCultivation] = useState(null)

  const loadRuralProperty = useCallback(async () => {
    if (id) {
      const res = await api.get(`cultivations/${id}`)
      setCultivation(res.data)
    }
  }, [id])

  const onSubmit = async (data) => {
    await api.put(`cultivations/${id}`, data)

    onEdited()
  }

  useEffect(() => {
    loadRuralProperty()
  }, [loadRuralProperty, id])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={register}
        name="name"
        label="Nome *"
        onChange={(value) => setValue('name', value)}
        defaultValue={cultivation?.name}
        error={errors.name}
      />

      <Input
        ref={register}
        name="variety"
        label="Variedade *"
        onChange={(value) => setValue('variety', value)}
        defaultValue={cultivation?.variety}
        error={errors.variety}
      />

      <Input
        ref={register}
        name="imageUrl"
        label="URL da imagem"
        onChange={(value) => setValue('imageUrl', value)}
        defaultValue={cultivation?.imageUrl}
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

export default EditCultivationForm