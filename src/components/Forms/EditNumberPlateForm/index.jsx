import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import errorMessages from '../errorMessages'

import { FlexRow } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'

const schema = yup.object().shape({
  code: yup.string().required(errorMessages.required),
  description: yup.string().required(errorMessages.required)
})

const EditNumberPlateForm = ({ data, onEdited, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (formData) => {
    onEdited({ ...data, ...formData })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={register}
        name="code"
        label="Código da placa *"
        defaultValue={data?.code}
        onChange={(value) => setValue('code', value)}
        error={errors.code}
      />

      <Input
        ref={register}
        name="description"
        label="Descrição do veículo *"
        defaultValue={data?.description}
        onChange={(value) => setValue('description', value)}
        error={errors.description}
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

export default EditNumberPlateForm