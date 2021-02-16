import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDialog } from '@hooks/dialog'

import api from '@services/api'
import errorMessages from '../errorMessages'
import colors from '@styles/colors'

import { FiTrash } from 'react-icons/fi'
import { FlexRow, Subtitle, List, ListItem, ListItemBox, ListEmpty, IconButton } from '@styles/components'
import Input from '@components/Input'
import Button from '@components/Button'
import CreateNumberPlateForm from '../CreateNumberPlateForm'

const schema = yup.object().shape({
  name: yup.string().required(errorMessages.required),
  phone1: yup.string(),
  phone2: yup.string()
})

const CreateCustomerForm = ({ onCreated, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })
  const { openDialog, closeDialog } = useDialog()

  const [numberPlates, setNumberPlates] = useState([])

  const onSubmit = async (data) => {
    const res = await api.post('customers', data)

    for (let numberPlate of numberPlates) {
      await api.post('numberPlates', { ...numberPlate, customerId: res.data.id })
    }

    onCreated()
  }

  const handleAddNumberPlate = (data) => {
    closeDialog()
    setNumberPlates([...numberPlates, data])
  }

  const openDialogCreateNubmerPlate = () => {
    openDialog({
      title: 'Nova placa',
      content: (
        <CreateNumberPlateForm
          onCreated={handleAddNumberPlate}
          onCancel={closeDialog}
        />
      )
    })
  }

  const removeNumberPlate = (index) => {
    const newNumberPlates = [...numberPlates]
    newNumberPlates.splice(index, 1)
    setNumberPlates(newNumberPlates)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        ref={register}
        name="name"
        label="Nome *"
        onChange={(value) => setValue('name', value)}
        error={errors.name}
      />

      <Input
        ref={register}
        name="phone1"
        label="Telefone 1"
        inputMode="numeric"
        phoneMask
        maxLength={15}
        onChange={(value) => setValue('phone1', value)}
        error={errors.phone1}
      />

      <Input
        ref={register}
        name="phone2"
        label="Telefone 2"
        inputMode="numeric"
        phoneMask
        maxLength={15}
        onChange={(value) => setValue('phone2', value)}
        error={errors.phone2}
      />

      <br />

      <FlexRow alignItems="center" justifyContent="space-between">
        <Subtitle marginBottom={0}>
          Placas
        </Subtitle>

        <Button onClick={openDialogCreateNubmerPlate}>
          Adicionar
        </Button>
      </FlexRow>

      <br />

      <List>
        {numberPlates.length ? numberPlates.map((item, index) => (
          <ListItem key={index}>
            <ListItemBox grow={1}>
              <p>Código: {item.code}</p>
              <p>Descrição: {item.description}</p>
            </ListItemBox>

            <ListItemBox>
              <IconButton type="button" onClick={() => removeNumberPlate(index)}>
                <FiTrash size={24} color={colors.red} />
              </IconButton>
            </ListItemBox>
          </ListItem>
        )) : (
          <ListEmpty>
            <i>Nenhuma placa foi adicionada a esse cliente.</i>
          </ListEmpty>
        )}
      </List>

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

export default CreateCustomerForm