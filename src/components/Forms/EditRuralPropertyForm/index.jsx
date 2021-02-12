import React, { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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

const EditRuralPropertyForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, control, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [ruralProperty, setRuralProperty] = useState(null)

  const loadRuralProperty = useCallback(async () => {
    if (id) {
      const res = await api.get(`ruralProperties/${id}`)
      setRuralProperty(res.data)
    }
  }, [id])

  const onSubmit = async (data) => {
    await api.put(`ruralProperties/${id}`, data)

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
        defaultValue={ruralProperty?.name}
        error={errors.name}
      />

      <Input
        ref={register}
        name="address"
        label="Endereço *"
        onChange={(value) => setValue('address', value)}
        defaultValue={ruralProperty?.address}
        error={errors.address}
      />

      <Controller
        control={control}
        name="area"
        defaultValue={ruralProperty?.area || 0}
        render={() => (
          <Input
            label="Área"
            inputMode="numeric"
            decimal
            defaultValue={ruralProperty?.area.toFixed(2)}
            onChange={(value) => setValue('area', Number(value))}
          />
        )}
      />

      <Input
        ref={register}
        name="description"
        label="Descrição"
        onChange={(value) => setValue('description', value)}
        defaultValue={ruralProperty?.description}
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

export default EditRuralPropertyForm