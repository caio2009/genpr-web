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
  date: yup.date()
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
      const res = await api.get(`harvests/${id}`)
      setHarvest(res.data)
    }
  }, [id])

  const loadCultivations = async () => {
    const res = await api.get('classifications')
    setClassifications(res.data)
  }

  const loadUnitMeasures = async () => {
    const res = await api.get('unit-measures')
    setUnitMeasures(res.data)
  }

  useEffect(() => {
    loadProduction()
    loadCultivations()
    loadUnitMeasures()
  }, [loadProduction])

  const onSubmit = async (data) => {
    // if (data.registerDate !== harvest.registerDate) {
    //   data.registerDate = new Date(new Date(data.registerDate).getTime() + 1000 * 60 * 60 * 3)
    // }

    await api.put(`harvests/${id}`, { 
      ...data,
      fieldId: harvest.field.id
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
        defaultValue={harvest?.cultivation.fullname}
        readOnly
      />

      <Select
        options={classifications.map(item => ({ label: `${item.name}`, value: item.id }))}
        ref={register}
        name="classificationId"
        label="Classificação *"
        onChange={(value) => setValue('classificationId', value)}
        defaultValue={harvest?.classification?.id}
        error={errors.classificationId}
      />

      <Select
        options={unitMeasures.map(item => ({ label: `${item.abbreviation}`, value: item.id }))}
        ref={register}
        name="unitMeasureId"
        label="Unidade de medida *"
        onChange={(value) => setValue('unitMeasureId', value)}
        defaultValue={harvest?.unitMeasure?.id}
        error={errors.unitMeasureId}
      />

      <Input
        ref={register}
        name="quantity"
        label="Quantidade *"
        inputMode="numeric"
        onChange={(value) => setValue('quantity', Number(value))}
        defaultValue={harvest?.quantity}
        error={errors.quantity}
      />

      {harvest?.registerDate && <Controller
        control={control}
        name="date"
        defaultValue={new Date(harvest?.registerDate)}
        render={() => (
          <InputDate
            label="Data *"
            onChange={(value) => setValue('date', new Date(value))}
            defaultValue={format(new Date(harvest?.date), 'yyyy-MM-dd')}
            error={errors.date}
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