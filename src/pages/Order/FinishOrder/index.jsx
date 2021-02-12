import React from 'react'
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
import Button from '@components/Button'

const schema = yup.object().shape({
  customer: yup.string().required(errorMessages.required),
  deliveryPlace: yup.string().required(errorMessages.required),
  date: yup.date()
})

const FinishOrder = () => {
  const history = useHistory()
  const { register, control, handleSubmit, setValue, errors } = useForm({
    resolver: yupResolver(schema)
  })
  const { cart, setCartData } = useGlobal()
  const { addToast } = useToast()

  const defaultDate = new Date()
  const totalPrice = cart.map(product => product.orderedQuantity * product.unitPrice).reduce((prev, curr) => prev + curr, 0)

  const onSubmit = async (data) => {
    let res = await api.post('orders', { ...data, totalPrice })

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
        availableQuantity: orderItem.availableQuantity - orderItem.orderedQuantity 
      })
    }

    addToast({
      title: 'Sucesso',
      description: 'Venda realizada com sucesso!'
    })

    setCartData([])
    history.push('/vendas/criar')
  }

  return (
    <Container page>
      <Title marginBottom={0}>
        Finalizar Venda
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          ref={register}
          name="customer"
          label="Cliente *"
          onChange={(value) => setValue('customer', value)}
          error={errors.customer}
        />

        <Input
          ref={register}
          name="deliveryPlace"
          label="Local de entrega *"
          onChange={(value) => setValue('deliveryPlace', value)}
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