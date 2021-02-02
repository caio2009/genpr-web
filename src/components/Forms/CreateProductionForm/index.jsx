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
  classificationId: yup.string().required(errorMessages.required),
  unitMeasureId: yup.string().required(errorMessages.required),
  quantity: yup.number().positive().moreThan(0),
  registerDate: yup.date()
})

const CreateProductionForm = ({ ruralProperty, field, cultivation, onCreated, onCancel }) => {
  const { register, control, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [classifications, setClassifications] = useState([])
  const [unitMeasures, setUnitMeasures] = useState([])

  const loadCultivations = async () => {
    const res = await api.get('classifications')
    setClassifications(res.data)
  }

  const loadUnitMeasures = async () => {
    const res = await api.get('unitMeasures')
    setUnitMeasures(res.data)
  }

  useEffect(() => {
    loadCultivations()
    loadUnitMeasures()
  }, [])

  const formatData = (data) => ({
    ...data,
    classificationId: Number(data.classificationId),
    unitMeasureId: Number(data.unitMeasureId),
    quantity: Number(data.quantity)
  })

  const onSubmit = async (data) => {
    data = formatData(data)

    await api.post('productions', { 
      ...data, 
      ruralPropertyId: ruralProperty.id, 
      fieldId: field.id, 
      cultivationId: cultivation.id 
    })

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
        label="Talhão *"
        defaultValue={field.name}
        readOnly
      />

      <Input
        label="Cultura *"
        defaultValue={cultivation.name}
        readOnly
      />

      <Select
        options={classifications.map(item => ({ label: `${item.name}`, value: item.id }))}
        ref={register}
        name="classificationId"
        label="Classificação *"
        onChange={(value) => setValue('classificationId', value)}
        error={errors.classificationId}
      />

      <Select
        options={unitMeasures.map(item => ({ label: `${item.abbreviation}`, value: item.id }))}
        ref={register}
        name="unitMeasureId"
        label="Unidade de medida *"
        onChange={(value) => setValue('unitMeasureId', value)}
        error={errors.unitMeasureId}
      />

      <Input
        ref={register}
        name="quantity"
        label="Quantidade *"
        inputMode="numeric"
        onChange={(value) => setValue('area', value)}
        defaultValue="0"
        error={errors.quantity}
      />

      <Controller
        control={control}
        name="registerDate"
        defaultValue={new Date()}
        render={() => (
          <InputDate
            label="Data de registro *"
            onChange={(value) => setValue('registerDate', new Date(value))}
            defaultValue={format(new Date(), 'yyyy-MM-dd')}
            error={errors.registerDate}
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

export default CreateProductionForm