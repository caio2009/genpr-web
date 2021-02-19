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
  classificationId: yup.string().required(errorMessages.required),
  unitMeasureId: yup.string().required(errorMessages.required),
  quantity: yup.number().positive().moreThan(0),
  registerDate: yup.date()
})

const EditHarvestForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, control, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [harvest, setHarvest] = useState(null)
  const [classifications, setClassifications] = useState([])
  const [unitMeasures, setUnitMeasures] = useState([])

  const loadProduction = useCallback(async () => {
    if (id) {
      const res = await api.get(`harvests/${id}?_expand=ruralProperty&_expand=field&_expand=cultivation`)
      setHarvest({
        ...res.data,
        cultivation: {
          id: res.data.cultivation.id,
          name: `${res.data.cultivation.name} ${res.data.cultivation.variety}`
        }
      })
    }
  }, [id])

  const loadCultivations = async () => {
    const res = await api.get('classifications')
    setClassifications(res.data)
  }

  const loadUnitMeasures = async () => {
    const res = await api.get('unitMeasures')
    setUnitMeasures(res.data)
  }

  useEffect(() => {
    loadProduction()
    loadCultivations()
    loadUnitMeasures()
  }, [loadProduction])

  const formatData = (data) => ({
    ...data,
    classificationId: Number(data.classificationId),
    unitMeasureId: Number(data.unitMeasureId),
    quantity: Number(data.quantity)
  })

  const onSubmit = async (data) => {
    data = formatData(data)

    if (data.registerDate !== harvest.registerDate) {
      data.registerDate = new Date(new Date(data.registerDate).getTime() + 1000 * 60 * 60 * 3)
    }

    await api.put(`harvests/${id}`, { 
      ...data, 
      ruralPropertyId: harvest.ruralProperty.id, 
      fieldId: harvest.field.id, 
      cultivationId: harvest.cultivation.id 
    })

    onEdited()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Propriedade rural *"
        defaultValue={harvest?.ruralProperty.name}
        readOnly
      />

      <Input
        label="Talhão *"
        defaultValue={harvest?.field.name}
        readOnly
      />

      <Input
        label="Cultura *"
        defaultValue={harvest?.cultivation.name}
        readOnly
      />

      <Select
        options={classifications.map(item => ({ label: `${item.name}`, value: item.id }))}
        ref={register}
        name="classificationId"
        label="Classificação *"
        onChange={(value) => setValue('classificationId', value)}
        defaultValue={harvest?.classificationId}
        error={errors.classificationId}
      />

      <Select
        options={unitMeasures.map(item => ({ label: `${item.abbreviation}`, value: item.id }))}
        ref={register}
        name="unitMeasureId"
        label="Unidade de medida *"
        onChange={(value) => setValue('unitMeasureId', value)}
        defaultValue={harvest?.unitMeasureId}
        error={errors.unitMeasureId}
      />

      <Input
        ref={register}
        name="quantity"
        label="Quantidade *"
        inputMode="numeric"
        onChange={(value) => setValue('area', value)}
        defaultValue={harvest?.quantity}
        error={errors.quantity}
      />

      {harvest?.registerDate && <Controller
        control={control}
        name="registerDate"
        defaultValue={new Date(harvest?.registerDate)}
        render={() => (
          <InputDate
            label="Data de registro *"
            onChange={(value) => setValue('registerDate', new Date(value))}
            defaultValue={format(new Date(harvest?.registerDate), 'yyyy-MM-dd')}
            error={errors.registerDate}
          />
        )}
      />}

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

export default EditHarvestForm