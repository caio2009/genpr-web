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
  licensePlate: yup.string().required(errorMessages.required),
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

  const [filteredlicensePlates, setFilteredLicensePlates] = useState([])
  const [filteredDeliveryPlaces, setFilteredDeliveryPlaces] = useState([])
  const [customerId, setCustomerId] = useState(undefined)

  const defaultDate = new Date()
  const totalPrice = cart.map(product => product.quantity * product.unitPrice).reduce((prev, curr) => prev + curr, 0)

  const onSubmit = async (data) => {
    const orderItems = []

    cart.forEach(product => {
      orderItems.push({
        unitPrice: product.unitPrice,
        quantity: product.quantity,
        harvestId: product.harvestId
      })
    })

    await api.post('orders', { ...data, customerId, totalPrice, orderItems })

    addToast({
      title: 'Sucesso',
      description: 'Venda realizada com sucesso!'
    })

    setCartData([])
    history.push('/vendas/criar')
  }

  const filterLicensePlates = async (value, { isSelected }) => {
    if (isSelected) {
      setFilteredLicensePlates([])
      setValue('licensePlate', value)

      getCustomerByLicensePlate()
      return
    }

    if (value) {
      const res = await api.get('license-plates')
      const licensePlates = res.data

      setFilteredLicensePlates(licensePlates.filter(licensePlate => licensePlate.code.toLowerCase().includes(value.toLowerCase())).map(licensePlate => ({ label: licensePlate.code })))
      setValue('licensePlate', value)
    } else {
      setFilteredLicensePlates([])
    }
  }

  const getCustomerByLicensePlate = async () => {
    const licensePlate = getValues('licensePlate')

    if (licensePlate) {
      const res = await api.get(`license-plates/query?code=${licensePlate}`)
      const data = res.data

      if (data) {
        customerInputRef.current.value = data.customer.name
        setValue('customer', data.customer.name)
        setCustomerId(data.customer.id)
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
      const res = await api.get('delivery-places')
      const deliveryPlaces = res.data

      setFilteredDeliveryPlaces(deliveryPlaces.filter(deliveryPlace => deliveryPlace.description.toLowerCase().includes(value.toLowerCase())).map(deliveryPlace => ({ label: deliveryPlace.description })))
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
          name="licensePlate"
          label="Placa do veículo *"
          uppercase
          options={filteredlicensePlates}
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
          defaultValue={`R$ ${totalPrice}`}
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
                  {item.ruralProperty.name} / {item.field.name}
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