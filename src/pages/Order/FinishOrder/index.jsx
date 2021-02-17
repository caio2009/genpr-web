import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useGlobal } from '@hooks/global'
import { useToast } from '@hooks/Toast/toast'

import api from '@services/api'
import errorMessages from '../../../components/Forms/errorMessages'
import { format } from 'date-fns'

import { Container, Title, Subtitle } from '@styles/components'
import { Cart, CartItem, ItemDescription, ItemQuantity } from '../BuildOrder/styles'
import Input from '@components/Input'
import InputDate from '@components/InputDate'
import Autocomplete from '@components/Autocomplete'
import Button from '@components/Button'

const schema = yup.object().shape({
  numberPlate: yup.string().required(errorMessages.required),
  customer: yup.string().required(errorMessages.required),
  deliveryPlace: yup.string().required(errorMessages.required),
  date: yup.date()
})

const FinishOrder = () => {
  const customerInputRef = useRef(null)

  const history = useHistory()
  const { register, control, handleSubmit, setValue, getValues, errors } = useForm({
    resolver: yupResolver(schema)
  })
  const { cart, setCartData } = useGlobal()
  const { addToast } = useToast()

  const [filteredNumberPlates, setFilteredNumberPlates] = useState([])
  const [filteredDeliveryPlaces, setFilteredDeliveryPlaces] = useState([])
  const [customerId, setCustomerId] = useState(-1)

  const defaultDate = new Date()
  const totalPrice = cart.map(product => product.orderedQuantity * product.unitPrice).reduce((prev, curr) => prev + curr, 0)

  const onSubmit = async (data) => {
    let res = await api.post('orders', { ...data, customerId, totalPrice })

    for (const orderItem of cart) {
      await api.post('orderItems', {
        orderId: res.data.id,
        productionId: orderItem.productionId,
        orderedQuantity: orderItem.orderedQuantity,
        unitPrice: orderItem.unitPrice
      })

      res = await api.get(`/productions/${orderItem.productionId}`)
      const production = res.data

      await api.put(`productions/${orderItem.productionId}`, {
        ...production,
        availableQuantity: production.availableQuantity - orderItem.orderedQuantity
      })
    }

    addToast({
      title: 'Sucesso',
      description: 'Venda realizada com sucesso!'
    })

    setCartData([])
    history.push('/vendas/criar')
  }

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

  return (
    <Container page>
      <Title>
        Finalizar Venda
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Autocomplete
          ref={register}
          name="numberPlate"
          label="Placa do veículo *"
          uppercase
          options={filteredNumberPlates}
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
          onChange={filterDeliveryPlaces}
          error={errors.deliveryPlace}
        />

        <Controller
          control={control}
          name="date"
          defaultValue={defaultDate}
          render={() => (
            <InputDate
              label="Data da venda *"
              onChange={(value) => setValue('date', new Date(value))}
              defaultValue={format(defaultDate, 'yyyy-MM-dd')}
              error={errors.date}
            />
          )}
        />

        <Input
          name="totalPrice"
          label="Preço total *"
          readOnly
          defaultValue={`R$ ${totalPrice.toFixed(2)}`}
        />

        <br />

        <Subtitle>
          Produtos da Venda
        </Subtitle>

        <Cart>
          {cart.map((item, index) => (
            <CartItem key={index}>
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
            </CartItem>
          ))}
        </Cart>

        <br />

        <Button type="submit" variant="primary">
          Finalizar Venda
        </Button>
      </form>
    </Container>
  )
}

export default FinishOrder