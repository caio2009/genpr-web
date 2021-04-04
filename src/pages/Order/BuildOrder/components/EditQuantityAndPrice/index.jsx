import React, { useEffect, useState, useCallback } from 'react'

import { FlexRow } from '@styles/components'
import { Wrapper, ProductField } from './styles'
import Input from '@components/Input'
import Button from '@components/Button'

import api from '@services/api'

const EditQuantityAndPrice = ({ product, onEdit }) => {
  const [harvest, setHarvest] = useState(null)
  const [quantity, setQuantity] = useState(undefined)
  const [unitPrice, setUnitPrice] = useState(undefined)

  const loadHarvest = useCallback(async () => {
    if (product) {
      const res = await api.get(`harvests/${product.harvestId}`)
      setHarvest(res.data)
    }
  }, [product])

  useEffect(() => {
    loadHarvest()

    if (product?.quantity) {
      setQuantity(product.quantity)
    }

    if (product?.unitPrice) {
      setUnitPrice(product.unitPrice.toFixed(2))
    }
  }, [product, loadHarvest])

  const updateProduct = () => {
    onEdit({ ...product, quantity: Number(quantity), unitPrice: Number(unitPrice) })
  }

  return (
    <div>
      <Input
        label="Produto"
        defaultValue={product?.cultivation.fullname}
      />

      <Input
        label="Classificação"
        defaultValue={product?.classification.name}
      />

      <Input
        label="Unidade de Medida"
        defaultValue={product?.unitMeasure.abbreviation}
      />

      <br />

      <Wrapper>
        <FlexRow justifyContent="space-between">
          <h4>
            {product?.ruralProperty.name}
          </h4>
        </FlexRow>

        <ProductField>
          <FlexRow alignItems="center" justifyContent="space-between">
            <div>
              <h4>
                {product?.field.name}
              </h4>

              <p>
                Qtd. Disponível: {harvest?.availableQuantity - quantity}
              </p>
            </div>

            <input
              type="text"
              inputMode="numeric"
              size={3}
              defaultValue={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onBlur={(e) => !e.target.value && (e.target.value = '0')}
              onClick={(e) => e.target.select()}
            />
          </FlexRow>
        </ProductField>
      </Wrapper>

      <Input
        name="unitPriceEdit"
        label="Preço Unitário"
        inputMode="numeric"
        decimalMask
        defaultValue={unitPrice}
        onChange={(value) => setUnitPrice(Number(value))}
      />

      <br />

      <Button variant="primary" full onClick={updateProduct}>
        Salvar
      </Button>
    </div>
  )
}

export default EditQuantityAndPrice