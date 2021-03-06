import React, { useCallback, useEffect, useState } from 'react'
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

const EditFieldForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, control, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [field, setField] = useState(null)
  const [cultivations, setCultivations] = useState([])

  const loadField = useCallback(async () => {
    if (id) {
      const res = await api.get(`fields/${id}?_expand=ruralProperty`)
      setField(res.data)
    }
  }, [id])

  const loadCultivations = async () => {
    const res = await api.get('cultivations')
    setCultivations(res.data)
  }

  const onSubmit = async (data) => {
    if (data.openingDate.getTime() !== new Date(field?.openingDate).getTime()) {
      data.openingDate = new Date(new Date(data.openingDate).getTime() + 1000 * 60 * 60 * 3)
    }

    await api.put(`fields/${id}`, { ...data, ruralPropertyId: field.ruralProperty.id })

    onEdited()
  }

  useEffect(() => {
    loadField()
    loadCultivations()
  }, [loadField, id])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Propriedade Rural *"
        defaultValue={field?.ruralProperty?.name}
        readOnly
      />

      <Input
        ref={register}
        name="name"
        label="Nome *"
        onChange={(value) => setValue('name', value)}
        defaultValue={field?.name}
        error={errors.name}
      />

      <Select
        options={cultivations.map(item => ({ label: `${item.name} ${item.variety}`, value: item.id }))}
        ref={register}
        name="cultivationId"
        label="Cultura *"
        onChange={(value) => setValue('cultivationId', value)}
        defaultValue={field?.cultivation.id}
        error={errors.cultivationId}
      />

      {field?.area !== undefined && <Controller
        control={control}
        name="area"
        defaultValue={field.area}
        render={() => (
          <Input
            label="Área"
            inputMode="numeric"
            decimalMask
            defaultValue={field.area}
            onChange={(value) => setValue('area', Number(value))}
            error={errors.area}
          />
        )}
      />}

      {field?.openingDate && <Controller
        control={control}
        name="openingDate"
        defaultValue={new Date(field.openingDate)}
        render={() => (
          <InputDate
            label="Data de abertura"
            onChange={(value) => setValue('openingDate', new Date(value))}
            defaultValue={format(new Date(field.openingDate), 'yyyy-MM-dd')}
            error={errors.openingDate}
          />
        )}
      />}

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

export default EditFieldForm