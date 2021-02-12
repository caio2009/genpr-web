import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import api from '@services/api'
import errorMessages from '../errorMessages'
import { format } from 'date-fns'

import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Select from '@components/Select'
import InputDate from '@components/InputDate'
import Button from '@components/Button'

const schema = yup.object().shape({
  name: yup.string().required(errorMessages.required),
  cultivationId: yup.number().required(errorMessages.required),
  area: yup.number(),
  openingDate: yup.date()
})

const CreateClassificationForm = ({ ruralProperty, onCreated, onCancel }) => {
  const { register, control, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [cultivations, setCultivations] = useState([])
  const defaultDate = new Date()

  const loadCultivations = async () => {
    const res = await api.get('cultivations')
    setCultivations(res.data)
  }

  useEffect(() => {
    loadCultivations()
  }, [])

  const onSubmit = async (data) => {
    if (data.openingDate.getTime() !== defaultDate.getTime()) {
      data.openingDate = new Date(new Date(data.openingDate).getTime() + 1000 * 60 * 60 * 3)
    }

    await api.post('fields', { ...data, ruralPropertyId: ruralProperty.id })

    onCreated()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Propriedade rural *"
        defaultValue={ruralProperty.name}
        readOnly
      />

      <Input
        ref={register}
        name="name"
        label="Nome *"
        onChange={(value) => setValue('name', value)}
        error={errors.name}
      />

      <Select
        options={cultivations.map(item => ({ label: `${item.name} ${item.variety}`, value: item.id }))}
        ref={register}
        name="cultivationId"
        label="Cultura *"
        onChange={(value) => setValue('cultivationId', value)}
        error={errors.cultivationId}
      />

      <Controller
        control={control}
        name="area"
        defaultValue="0.00"
        render={() => (
          <Input
            label="Área"
            inputMode="numeric"
            decimal
            defaultValue="0.00"
            onChange={(value) => setValue('area', Number(value))}
          />
        )}
      />

      <Controller
        control={control}
        name="openingDate"
        defaultValue={defaultDate}
        render={() => (
          <InputDate
            label="Data de abertura *"
            onChange={(value) => setValue('openingDate', new Date(value))}
            defaultValue={format(defaultDate, 'yyyy-MM-dd')}
            error={errors.openingDate}
          />
        )}
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

export default CreateClassificationForm