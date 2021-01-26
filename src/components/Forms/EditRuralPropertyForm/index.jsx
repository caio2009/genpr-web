import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import api from '../../../services/api'

import { FlexRow } from '../../../styles/components'
import Input from '../../Input'
import Button from '../../Button'

const EditRuralPropertyForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, setValue, handleSubmit } = useForm()

  const [ruralProperty, setRuralProperty] = useState(null)

  const loadRuralProperty = useCallback(async () => {
    if (id) {
      const res = await api.get(`ruralProperties/${id}`)
      setRuralProperty(res.data)
    }
  }, [id])

  const formatData = (data) => ({
    ...data,
    area: Number(data.area)
  })

  const onSubmit = async (data) => {
    data = formatData(data)

    await api.put(`ruralProperties/${id}`, data)

    onEdited()
  }

  useEffect(() => {
    loadRuralProperty()
  }, [loadRuralProperty])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={register}
        name="name"
        label="Nome *"
        onChange={(value) => setValue('name', value)}
        defaultValue={ruralProperty?.name}
      />

      <Input
        ref={register}
        name="address"
        label="Endereço *"
        onChange={(value) => setValue('address', value)}
        defaultValue={ruralProperty?.address}
      />

      <Input
        ref={register}
        name="area"
        label="Área"
        inputMode="numeric"
        onChange={(value) => setValue('area', value)}
        defaultValue={ruralProperty?.area}
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