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
  name: yup.string().required(errorMessages.required)
})

const EditCultivationForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [classification, setClassification] = useState(null)

  const loadRuralProperty = useCallback(async () => {
    if (id) {
      const res = await api.get(`classifications/${id}`)
      setClassification(res.data)
    }
  }, [id])

  const formatData = (data) => ({
    ...data,
    area: Number(data.area)
  })

  const onSubmit = async (data) => {
    data = formatData(data)

    await api.put(`classifications/${id}`, data)

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
        defaultValue={classification?.name}
        error={errors.name}
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