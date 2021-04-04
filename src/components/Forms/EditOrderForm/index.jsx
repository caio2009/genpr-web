import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useModal } from '@hooks/modal'
import { useGlobal } from '@hooks/global'
import colors from '@styles/colors'

import api from '@services/api'
import errorMessages from '../errorMessages'
import { format } from 'date-fns'
import currencyFormat from '@utils/currencyFormat'

import { FiTrash } from 'react-icons/fi'
import { FlexRow, IconButton, Subtitle } from '@styles/components'
import { Cart, CartItem, ItemDescription, ItemQuantity, ItemControl, Empty } from '@pages/Order/BuildOrder/styles'
import Input from '@components/Input'
import InputDate from '@components/InputDate'
import Autocomplete from '@components/Autocomplete'
import Button from '@components/Button'
import EditQuantityAndPrice from '@pages/Order/BuildOrder/components/EditQuantityAndPrice'
import AddProducts from '@pages/Order/BuildOrder/components/AddProducts'

const schema = yup.object().shape({
  licensePlate: yup.string().required(errorMessages.required),
  customer: yup.string().required(errorMessages.required),
  deliveryPlace: yup.string().required(errorMessages.required),
  date: yup.date()
})

const EditOrderForm = ({ entityId: id, onEdited, onCancel }) => {
  const isMounted = useRef(true)
  const customerInputRef = useRef(null)

  const { register, control, setValue, getValues, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })
  const { openConfirmDialog } = useConfirmDialog()
  const { openModal, closeModal } = useModal()
  const { cart, setCartData } = useGlobal()

  const totalPriceInputRef = useRef(null)

  const [order, setOrder] = useState(null)
  const [filteredNumberPlates, setFilteredLicensePlates] = useState([])
  const [filteredDeliveryPlaces, setFilteredDeliveryPlaces] = useState([])
  const [customerId, setCustomerId] = useState(undefined)
  const [licensePlateId, setLicensePlateId] = useState(undefined)
  const [deliveryPlaceId, setDeliveryPlaceId] = useState(undefined)

  const loadOrder = useCallback(async (isMounted) => {
    if (id && isMounted) {
      const res = await api.get(`orders/${id}`)
      const order = res.data

      setOrder(order)
      setCartData(order.orderItems)

      if (order.customer.name) {
        setValue('customer', order.customer.name)
        setCustomerId(order.customer.id)
      } else {
        setValue('customer', order.customer)
      }

      if (order.licensePlate.id) {
        setLicensePlateId(order.licensePlate.id)
      }

      if (order.deliveryPlace.id) {
        setDeliveryPlaceId(order.deliveryPlace.id)
      }
    }
  }, [id, setValue, setCartData])

  const loadTotalPrice = useCallback(() => {
    const totalPrice = cart.map(product => product.quantity * product.unitPrice).reduce((prev, curr) => prev + curr, 0)
    totalPriceInputRef.current.value = currencyFormat(totalPrice)
  }, [cart])

  const onSubmit = async (data) => {
    const totalPrice = cart.map(product => product.quantity * product.unitPrice).reduce((prev, curr) => prev + curr, 0)

    const orderItems = []

    cart.forEach(product => {
      orderItems.push({
        unitPrice: product.unitPrice,
        quantity: product.quantity,
        harvestId: product.harvestId
      })
    })

    await api.put(`orders/${id}`, {
      ...data,
      totalPrice,
      customerId,
      licensePlateId,
      deliveryPlaceId,
      orderItems
    })

    setCartData([])

    onEdited()
  }

  useEffect(() => {
    loadOrder(isMounted.current)

    return () => { isMounted.current = false }
  }, [loadOrder, id])

  useEffect(() => {
    loadTotalPrice()
  }, [loadTotalPrice])

  const filterLicensePlates = async (value, { isSelected }) => {
    if (isSelected) {
      setFilteredLicensePlates([])
      setValue('licensePlate', value)

      getCostumerByNumberPlate()
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

  const getCostumerByNumberPlate = async () => {
    const licensePlate = getValues('license-plate')

    if (licensePlate) {
      const res = await api.get(`licensePlates/query?code=${licensePlate}`)
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
      setValue('delivery-place', value)
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

  const openModalEditQuantityAndPrice = (index) => {
    openModal({
      id: 'quantityAndPrice',
      title: 'Quantidade e Preço',
      content: (
        <EditQuantityAndPrice
          product={order.orderItems[index]}
          onEdit={handleEditQuantityAndPrice}
        />
      )
    })
  }

  const openModalAddProduct = () => {
    openModal({
      id: 'addProduct',
      title: 'Adicionar Produto',
      content: (
        <AddProducts
          onAdd={handleAddProduct}
          orderItems={order.orderItems}
        />
      )
    })
  }

  const handleEditQuantityAndPrice = (product) => {
    closeModal('quantityAndPrice')

    const newCart = [...cart]

    const index = newCart.findIndex(el => el.harvestId === product.harvestId)
    newCart[index] = product

    setCartData(newCart)
  }

  const removeProduct = (e, index) => {
    e.stopPropagation()
    e.preventDefault()

    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Tem certeza que deseja remover esse item da venda?'
    }).then(res => {
      if (res) {
        const newCart = [...cart]
        newCart.splice(index, 1)
        setCartData(newCart)
      }
    })
  }

  const handleAddProduct = (products) => {
    closeModal('addProduct')
    setCartData([...cart, ...products])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="orderId"
        label="Número da venda"
        defaultValue={order?.id}
        readOnly
      />

      <Autocomplete
        ref={register}
        name="licensePlate"
        label="Placa do veículo *"
        uppercase
        options={filteredNumberPlates}
        defaultValue={order?.licensePlate.code || order?.licensePlate}
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
            defaultValue={order?.customer.name || order?.customer}
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
        defaultValue={order?.deliveryPlace.description || order?.deliveryPlace}
        onChange={filterDeliveryPlaces}
        error={errors.deliveryPlace}
      />

      {order?.date && <Controller
        control={control}
        name="date"
        defaultValue={new Date(order.date)}
        render={() => (
          <InputDate
            label="Data da venda *"
            onChange={(value) => setValue('date', new Date(value))}
            defaultValue={order.date && format(new Date(order.date), 'yyyy-MM-dd')}
            error={errors.date}
          />
        )}
      />}

      <Input
        ref={totalPriceInputRef}
        name="totalPrice"
        label="Preço total *"
        readOnly
      />

      <br />

      <FlexRow alignItems="center" justifyContent="space-between">
        <Subtitle>
          Produtos da venda
        </Subtitle>

        <Button onClick={openModalAddProduct}>
          Adicionar
        </Button>
      </FlexRow>

      <br />

      <Cart>
        {cart.map((product, index) => (
          <CartItem key={index} onClick={() => openModalEditQuantityAndPrice(index)}>
            <ItemDescription>
              <strong>
                {product.cultivation.fullname} {product.classification.name} {product.unitMeasure.abbreviation}
              </strong>

              <p>
                {product.ruralProperty.name} / {product.field.name}
              </p>

              <p>
                Preço Unitário: {currencyFormat(product.unitPrice)}
              </p>

              <p>
                Subtotal: {currencyFormat(product.unitPrice * product.quantity)}
              </p>
            </ItemDescription>

            <ItemQuantity>
              <strong>X {product.quantity}</strong>
            </ItemQuantity>

            <ItemControl>
              <IconButton onClick={(e) => removeProduct(e, index)}>
                <FiTrash size={20} color={colors.red} />
              </IconButton>
            </ItemControl>
          </CartItem>
        ))}

        {!cart.length && (
          <Empty>
            <i>Nenhum produto foi adicionado.</i>
          </Empty>
        )}
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