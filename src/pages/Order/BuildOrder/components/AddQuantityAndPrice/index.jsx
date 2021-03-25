import React, { useState, useCallback, useEffect } from 'react'
import { useGlobal } from '@hooks/global'

import api from '@services/api'

import { FlexRow } from '@styles/components'
import { Wrapper, ProductField } from './styles'
import Input from '@components/Input'
import Button from '@components/Button'

const AddQuantityAndPrice = ({ product, onAdd }) => {
  const { cart } = useGlobal()

  const [details, setDetails] = useState([])
  const [quantityValues, setQuantityValues] = useState({})
  const [unitPrice, setUnitPrice] = useState(null)

  const loadDetails = useCallback(async () => {
    if (product) {
      const res = await api.get(`stock/details?cultivation_id=${product.cultivation.id}&classification_id=${product.classification.id}&unit_measure_id=${product.unitMeasure.id}`)
      setDetails(res.data)
    }
  }, [product])

  useEffect(() => {
    loadDetails()
  }, [product, loadDetails])

  const setQuantityValue = (key, value) => {
    const newObj = { ...quantityValues }
    newObj[key] = value
    setQuantityValues(newObj)
  }

  const addProducts = () => {
    const productsToAdd = []

    for (let key in quantityValues) {
      let ruralProperty = details.origins.find(origin => origin.ruralProperty.harvests.map(harvest => harvest.id).includes(Number(key))).ruralProperty
      let harvest = ruralProperty.harvests.find(harvest => harvest.id === Number(key))

      if (quantityValues[key] > 0) {
        const obj = {
          ...product,
          harvestId: harvest.id,
          ruralProperty: { id: ruralProperty.id, name: ruralProperty.name },
          field: { id: harvest.field.id, name: harvest.field.name },
          quantity: Number(quantityValues[key]),
          unitPrice: Number(unitPrice)
        }

        productsToAdd.push(obj)
      }
    }

    onAdd(productsToAdd)
  }

  return (
    <div>
      <Input
        label="Produto"
        defaultValue={product?.cultivation.fullname}
        readOnly
      />

      <Input
        label="Classificação"
        defaultValue={product?.classification.name}
        readOnly
      />

      <Input
        label="Unidade de Medida"
        defaultValue={product?.unitMeasure.abbreviation}
        readOnly
      />

      <br />

      {details?.origins?.map((origin, index) => (
        <Wrapper key={index}>
          <FlexRow justifyContent="space-between">
            <h4>
              {origin.ruralProperty.name}
            </h4>
          </FlexRow>

          {origin.ruralProperty.harvests.map((harvest, index) => (
            <ProductField key={index}>
              <FlexRow alignItems="center" justifyContent="space-between">
                <div>
                  <h4>
                    {harvest.field.name}
                  </h4>

                  <p>
                    Qtd. Disponível: {harvest.availableQuantity - (cart.filter(product => !product.id && product.harvestId === harvest.id).map(product => product.quantity).reduce((prev, curr) => prev + curr, 0)) - (quantityValues[harvest.id] || 0)}
                  </p>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  size={3}
                  defaultValue={quantityValues[harvest.id] || '0'}
                  onChange={(e) => setQuantityValue(harvest.id, Number(e.target.value))}
                  onClick={(e) => e.target.select()}
                  onBlur={(e) => !e.target.value && (e.target.value = '0')}
                />
              </FlexRow>
            </ProductField>
          ))}
        </Wrapper>
      ))}

      <Input
        name="unitPrice"
        label="Preço Unitário"
        inputMode="numeric"
        decimalMask
        defaultValue="0.00"
        onChange={(value) => setUnitPrice(Number(value))}
      />

      <br />

      <Button variant="primary" full onClick={addProducts}>
        Adicionar
      </Button>
    </div>
  )
}

export default AddQuantityAndPrice