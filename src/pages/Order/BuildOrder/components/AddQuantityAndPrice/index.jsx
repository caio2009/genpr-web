import React, { useState, useCallback, useEffect } from 'react'

import api from '@services/api'

import { FlexRow } from '@styles/components'
import { Wrapper, ProductField } from './styles'
import Input from '@components/Input'
import Button from '@components/Button'

const AddQuantityAndPrice = ({ product, onAdd }) => {
  const [ruralProperties, setRuralProperties] = useState([])
  const [quantityValues, setQuantityValues] = useState({})
  const [unitPrice, setUnitPrice] = useState(null)
  const unitMeasureAbbreviation = product?.unitMeasure.abbreviation


  const loadRuralProperties = useCallback(async () => {
    if (product?.fields) {
      const res = await api.get('ruralProperties')
      setRuralProperties(res.data.filter(x => product.fields.find(y => y.ruralPropertyId === x.id)))
    }
  }, [product])

  useEffect(() => {
    loadRuralProperties()
  }, [product, loadRuralProperties])

  const setQuantityValue = (key, value) => {
    const newObj = {...quantityValues}
    newObj[key] = value
    setQuantityValues(newObj)
  }

  const addProducts = () => {
    const productsToAdd = []

    for (let key in quantityValues) {
      if (quantityValues[key] > 0) {
        const field = product.fields.find(item => item.id === Number(key))

        const ruralProperty = ruralProperties.find(item => item.id === field.ruralPropertyId)

        const obj = {
          ...product,
          field,
          ruralProperty,
          orderedQuantity: Number(quantityValues[key]),
          unitPrice
        }

        delete obj.fields
        delete obj.quantity

        productsToAdd.push(obj)
      }
    }

    onAdd(productsToAdd)
  }

  return (
    <div>
      <Input
        label="Produto"
        defaultValue={product?.cultivation.name}
      />

      <Input
        label="Unidade de Medida"
        defaultValue={unitMeasureAbbreviation}
      />

      <br />

      {ruralProperties.length > 0 && ruralProperties.map((rp, index) => (
        <Wrapper key={index}>
          <FlexRow justifyContent="space-between">
            <h4>
              {rp.name}
            </h4>
          </FlexRow>

          {product?.fields && product.fields.filter(item => item.ruralPropertyId === rp.id).map((item, index) => (
            <ProductField key={index}>
              <FlexRow alignItems="center" justifyContent="space-between">
                <div>
                  <h4>
                    {item.name}
                  </h4>

                  <p>
                    Qtd. Disponível: {item.quantity}
                  </p>
                </div>

                <input 
                  type="text" 
                  inputMode="numeric" 
                  size={3} 
                  defaultValue={quantityValues[item.id] || '0'}
                  onChange={(e) => setQuantityValue(item.id, e.target.value)}
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
        onChange={(value) => setUnitPrice(value)}
      />

      <br />

      <Button variant="primary" full onClick={addProducts}>
        Adicionar
      </Button>
    </div>
  )
}

export default AddQuantityAndPrice