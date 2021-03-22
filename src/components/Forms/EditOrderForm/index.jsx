import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useModal } from '@hooks/modal'
import colors from '@styles/colors'

import api from '@services/api'
import errorMessages from '../errorMessages'
import { format } from 'date-fns'

import { FiTrash } from 'react-icons/fi'
import { FlexRow, IconButton, Subtitle } from '@styles/components'
import { Cart, CartItem, ItemDescription, ItemQuantity, ItemControl } from '@pages/Order/BuildOrder/styles'
import Input from '@components/Input'
import InputDate from '@components/InputDate'
import Autocomplete from '@components/Autocomplete'
import Button from '@components/Button'
import EditQuantityAndPrice from '@pages/Order/BuildOrder/components/EditQuantityAndPrice'

const schema = yup.object().shape({
  name: yup.string().required(errorMessages.required)
})

const EditOrderForm = ({ entityId: id, onEdited, onCancel }) => {
  const customerInputRef = useRef(null)

  const { register, control, setValue, getValues, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })
  const { openConfirmDialog } = useConfirmDialog()
  const { openModal, closeModal } = useModal()

  const [order, setOrder] = useState(null)
  const [filteredNumberPlates, setFilteredLicensePlates] = useState([])
  const [filteredDeliveryPlaces, setFilteredDeliveryPlaces] = useState([])
  const [customerId, setCustomerId] = useState(undefined)

  const loadOrder = useCallback(async () => {
    if (id) {
      const res = await api.get(`orders/${id}`)
      setOrder(res.data)

      if (res.data.customerId) {
        setCustomerId(res.data.customerId)
      }
    }
  }, [id])

  const onSubmit = async (data) => {
    await api.put(`classifications/${id}`, { ...data, customerId })

    onEdited()
  }

  useEffect(() => {
    loadOrder()
  }, [loadOrder, id])

  const filterLicensePlates = async (value, { isSelected }) => {
    if (isSelected) {
      setFilteredLicensePlates([])
      setValue('licensePlate', value)

      getCostumerByNumberPlate()
      return
    }

    if (value) {
      const res = await api.get('licensePlates')
      const licensePlates = res.data

      setFilteredLicensePlates(licensePlates.filter(licensePlate => licensePlate.code.toLowerCase().includes(value.toLowerCase())).map(licensePlate => ({ label: licensePlate.code })))
      setValue('licensePlate', value)
    } else {
      setFilteredLicensePlates([])
    }
  }

  const getCostumerByNumberPlate = async () => {
    const licensePlate = getValues('licensePlate')

    if (licensePlate) {
      const res = await api.get(`licensePlates/query?code=${licensePlate}`)
      const data = res.data

      if (data) {
        customerInputRef.current.value = data.customer.name
        setValue('customer', data.customer.name)
        setCustomerId(data.customer.id)
        console.log(getValues('customerId'))
      }
    }
  }

  const filterDeliveryPlaces = async (value, { isSelected }) => {
    if (isSelected) {
      setFilteredDeliveryPlaces([])
      setValue('deliveryPlace', value)
      return
    }

    if (value) {
      const res = await api.get('deliveryPlaces')
      const deliveryPlaces = res.data

      setFilteredDeliveryPlaces(deliveryPlaces.filter(deliveryPlace => deliveryPlace.description.toLowerCase().includes(value.toLowerCase())).map(deliveryPlace => ({ label: deliveryPlace.description })))
      setValue('deliveryPlace', value)
    } else {
      setFilteredDeliveryPlaces([])
    }
  }

  const openModalEditQuantityAndPrice = (index) => {
    openModal({
      title: 'Quantidade e Preço',
      content: (
        <EditQuantityAndPrice
          product={order.orderItems[index]}
          onEdit={handleEditQuantityAndPrice}
        />
      )
    })
  }

  const handleEditQuantityAndPrice = (product) => {
    closeModal()

    const newOrderItems = [...order.orderItems]

    const index = newOrderItems.findIndex(orderItem => orderItem.harvestId === product.harvestId)
    newOrderItems[index] = product

    setOrder({ ...order, orderItems: newOrderItems })
  }

  const removeProduct = (e, index) => {
    e.stopPropagation()

    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Tem certeza que deseja remover esse item da venda?'
    }).then(res => {
      if (res) {
        const newOrderItems = [...order.orderItems]
        newOrderItems.splice(index, 1)
        setOrder({ ...order, orderItems: newOrderItems })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Autocomplete
        ref={register}
        name="licensePlate"
        label="Placa do veículo *"
        uppercase
        options={filteredNumberPlates}
        defaultValue={order?.licensePlate || order?.licensePlate.code}
        onChange={filterLicensePlates}
        error={errors.licensePlate}
      />

      <Controller
        control={control}
        name="customer"
        defaultValue={''}
        render={() => (
          <Input
            ref={customerInputRef}
            label="Cliente *"
            defaultValue={order?.customer || order?.customer.name}
            onChange={(value) => setValue('customer', value)}
            error={errors.customer}
          />
        )}
      />

      <Autocomplete
        ref={register}
        name="deliveryPlace"
        label="Local de entrega *"
        options={filteredDeliveryPlaces}
        defaultValue={order?.deliveryPlace || order?.deliveryPlace.description}
        onChange={filterDeliveryPlaces}
        error={errors.deliveryPlace}
      />

      <Controller
        control={control}
        name="date"
        defaultValue={new Date(order?.date)}
        render={() => (
          <InputDate
            label="Data da venda *"
            onChange={(value) => setValue('date', new Date(value))}
            defaultValue={order?.date && format(new Date(order?.date), 'yyyy-MM-dd')}
            error={errors.date}
          />
        )}
      />

      <br />

      <Subtitle>
        Produtos da venda
      </Subtitle>

      <Cart>
        {order?.orderItems.map((item, index) => (
          <CartItem key={index} onClick={() => openModalEditQuantityAndPrice(index)}>
            <ItemDescription>
              <strong>
                {item.cultivation.fullname} {item.classification.name} {item.unitMeasure.abbreviation}
              </strong>

              <p>
                {/* Origem: {item.ruralProperty.name} / {item.field.name} */}
              </p>

              <p>
                Preço Unitário: R$ {item.unitPrice}
              </p>

              <p>
                Subtotal: R$ {item.unitPrice * item.quantity}
              </p>
            </ItemDescription>

            <ItemQuantity>
              <strong>X {item.quantity}</strong>
            </ItemQuantity>

            <ItemControl>
              <IconButton onClick={(e) => removeProduct(e, index)}>
                <FiTrash size={20} color={colors.red} />
              </IconButton>
            </ItemControl>
          </CartItem>
        ))}
      </Cart>

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

export default EditOrderForm