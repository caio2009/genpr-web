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

const EditCustomerForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const [customer, setCustomer] = useState(null)

  const loadCustomer = useCallback(async () => {
    if (id) {
      const res = await api.get(`customers/${id}`)
      setCustomer(res.data)
    }
  }, [id])

  const onSubmit = async (data) => {
    await api.put(`customers/${id}`, data)

    onEdited()
  }

  useEffect(() => {
    loadCustomer()
  }, [loadCustomer, id])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={register}
        name="name"
        label="Nome *"
        onChange={(value) => setValue('name', value)}
        defaultValue={customer?.name}
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

export default EditCustomerForm