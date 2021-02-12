import React, { useCallback, useEffect, useState } from 'react'
import { useGlobal } from '@hooks/global';

import api from '@services/api'

import { FlexRow } from '@styles/components'
import { Wrapper, ProductField } from './styles'
import Input from '@components/Input'
import Button from '@components/Button'

const EditQuantityAndPrice = ({ product, onEdit }) => {
  const { cart } = useGlobal()

  const [production, setProduction] = useState(null)
  const [quantity, setQuantity] = useState(undefined)
  const [unitPrice, setUnitPrice] = useState(undefined)

  const loadProduction = useCallback(async () => {
    if (product) {
      const res = await api.get(`productions/${product.productionId}`)
      setProduction(res.data)
    }
  }, [product])

  useEffect(() => {
    loadProduction()
  }, [product, loadProduction])

  useEffect(() => {
    if (product?.orderedQuantity) {
      setQuantity(product.orderedQuantity)
    }

    if (product?.unitPrice) {
      setUnitPrice(product.unitPrice.toFixed(2))
    }
  }, [product])

  const updateProduct = () => {
    onEdit({ ...product, orderedQuantity: Number(quantity), unitPrice: Number(unitPrice) })
  }

  return (
    <div>
      <Input
        label="Produto"
        defaultValue={product?.cultivation.name}
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
                Qtd. Disponível: {production?.quantity - cart.filter(item => item.productionId === product?.productionId).map(item => item.orderedQuantity).reduce((prev, curr) => prev + curr, 0)}
              </p>
            </div>

            <input
              type="text"
              inputMode="numeric"
              size={3}
              defaultValue={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onClick={(e) => e.target.select()}
            />
          </FlexRow>
        </ProductField>
      </Wrapper>

      <Input
        name="unitPriceEdit"
        label="Preço Unitário"
        inputMode="numeric"
        decimal
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