import React, { useCallback, useEffect, useState } from 'react'
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
import EditNumberPlateForm from '../EditNumberPlateForm'

const schema = yup.object().shape({
  name: yup.string().required(errorMessages.required),
  phone1: yup.string(),
  phone2: yup.string()
})

const EditCustomerForm = ({ entityId: id, onEdited, onCancel }) => {
  const { register, setValue, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })
  const { openDialog, closeDialog } = useDialog()

  const [customer, setCustomer] = useState(null)
  const [numberPlates, setNumberPlates] = useState([])
  const [removedNumberPlates, setRemovedNumberPlates] = useState([])

  const loadCustomer = useCallback(async () => {
    if (id) {
      const res = await api.get(`customers/${id}?_embed=numberPlates`)
      setCustomer(res.data)
      setNumberPlates(res.data.numberPlates)
    }
  }, [id])

  useEffect(() => {
    loadCustomer()
  }, [loadCustomer])

  const onSubmit = async (data) => {
    await api.put(`customers/${id}`, data)

    // remove number plate
    for (let { id } of removedNumberPlates) {
      await api.delete(`numberPlates/${id}`)
    }

    // add and edit number plate
    for (let numberPlate of numberPlates) {
      const findedNumbePlate = customer.numberPlates.find(x => x.id === numberPlate.id)

      if (findedNumbePlate) {
        if (JSON.stringify(numberPlate) !== JSON.stringify(findedNumbePlate)) {
          await api.put(`numberPlates/${numberPlate.id}`, numberPlate)
        }
      } else {
        await api.post('numberPlates', { ...numberPlate, customerId: customer.id })
      }
    }

    onEdited()
  }

  const handleAddNumberPlate = (data) => {
    closeDialog()
    setNumberPlates([...numberPlates, data])
  }

  const handleEditNumberPlate = (data, index) => {
    closeDialog()
    const newNumberPlates = [...numberPlates]
    newNumberPlates[index] = data
    setNumberPlates(newNumberPlates)
  }

  const openDialogAddNumberPlate = () => {
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

  const openDialogEditNumberPlate = (index) => {
    openDialog({
      title: 'Editar placa',
      content: (
        <EditNumberPlateForm
          data={numberPlates[index]}
          onEdited={(data) => handleEditNumberPlate(data, index)}
          onCancel={closeDialog}
        />
      )
    })
  }

  const removeNumberPlate = (index) => {
    setRemovedNumberPlates([ ...removedNumberPlates, numberPlates[index] ])

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
        defaultValue={customer?.name}
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
        defaultValue={customer?.phone1}
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
        defaultValue={customer?.phone2}
        onChange={(value) => setValue('phone2', value)}
        error={errors.phone2}
      />

      <br />

      <FlexRow alignItems="center" justifyContent="space-between">
        <Subtitle marginBottom={0}>
          Placas
        </Subtitle>

        <Button onClick={openDialogAddNumberPlate}>
          Adicionar
        </Button>
      </FlexRow>

      <br />

      <List>
        {numberPlates.length ? numberPlates.map((item, index) => (
          <ListItem key={index} onClick={() => openDialogEditNumberPlate(index)}>
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

export default EditCustomerForm