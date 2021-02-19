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
import { FlexRow, IconButton } from '@styles/components'
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
  const [filteredNumberPlates, setFilteredNumberPlates] = useState([])
  const [filteredDeliveryPlaces, setFilteredDeliveryPlaces] = useState([])
  const [customerId, setCustomerId] = useState(-1)

  const loadOrder = useCallback(async () => {
    if (id) {
      const res = await api.get(`orders/${id}?_embed=orderItems`)
      setOrder(res.data)

      if (res.data.customerId) {
        setCustomerId(res.data.customerId)
      }
    }
  }, [id])

  const onSubmit = async (data) => {
    // await api.put(`classifications/${id}`, data)

    // onEdited()
  }

  useEffect(() => {
    loadOrder()
  }, [loadOrder, id])

  const filterNumberPlates = async (value, { isSelected }) => {
    if (isSelected) {
      setFilteredNumberPlates([])
      setValue('numberPlate', value)

      getCostumerByNumberPlate()
      return
    }

    if (value) {
      const res = await api.get('numberPlates')
      const numberPlates = res.data

      setFilteredNumberPlates(numberPlates.filter(x => x.code.toLowerCase().includes(value.toLowerCase())).map(x => ({ label: x.code })))
      setValue('numberPlate', value)
    } else {
      setFilteredNumberPlates([])
    }
  }

  const getCostumerByNumberPlate = async () => {
    const numberPlate = getValues('numberPlate')

    if (numberPlate) {
      const res = await api.get(`numberPlates?code=${numberPlate}&_expand=customer`)
      const data = res.data[0]

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

      setFilteredDeliveryPlaces(deliveryPlaces.filter(x => x.description.toLowerCase().includes(value.toLowerCase())).map(x => ({ label: x.description })))
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

    const index = newOrderItems.findIndex(x => x.field.productionId === product.field.productionId)
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
        name="numberPlate"
        label="Placa do veículo *"
        uppercase
        options={filteredNumberPlates}
        defaultValue={order?.numberPlate}
        onChange={filterNumberPlates}
        error={errors.numberPlate}
      />

      <Controller
        control={control}
        name="customer"
        defaultValue={''}
        render={() => (
          <Input
            ref={customerInputRef}
            label="Cliente *"
            defaultValue={order?.customer}
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
        defaultValue={order?.deliveryPlace}
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

      <Cart>
        {order?.orderItems.map((item, index) => (
          <CartItem key={index} onClick={() => openModalEditQuantityAndPrice(index)}>
            <ItemDescription>
              <strong>
                {item.cultivation.name} {item.classification.name} {item.unitMeasure.abbreviation}
              </strong>

              <p>
                Origem: {item.ruralProperty.name} / {item.field.name}
              </p>

              <p>
                Preço Unitário: R$ {Number(item.unitPrice).toFixed(2)}
              </p>

              <p>
                Subtotal: R$ {Number(item.unitPrice * item.orderedQuantity).toFixed(2)}
              </p>
            </ItemDescription>

            <ItemQuantity>
              <strong>X {item.orderedQuantity}</strong>
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