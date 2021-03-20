import React, { useCallback, useEffect, useState } from 'react'

import api from '@services/api'

import { Subtitle, FlexRow } from '@styles/components'
import { Wrapper, ItemDetail } from './styles'

const StockItemDetail = ({ item }) => {
  const [details, setDetails] = useState([])

  const loadDetails = useCallback(async () => {
    if (item) {
      const res = await api.get(`stock/details?cultivation_id=${item.cultivation.id}&classification_id=${item.classification.id}&unit_measure_id=${item.unitMeasure.id}`)
      setDetails(res.data)
    }
  }, [item])

  useEffect(() => {
    loadDetails()
  }, [item, loadDetails])

  return (
    <div>
      <Subtitle>
        Origem
      </Subtitle>

      {details?.origins?.map((origin, index) => (
        <Wrapper key={index}>
          <FlexRow justifyContent="space-between" bottom={0.5}>
            <p>
              {origin.ruralProperty.name}
            </p>

            <p>
              Total: {origin.ruralProperty.harvests.map(harvest => harvest.availableQuantity).reduce((prev, curr) => prev + curr, 0)} {details?.unitMeasure.abbreviation}
            </p>
          </FlexRow>

          {origin.ruralProperty.harvests.map((harvest, index) => (
            <ItemDetail key={index}>
              <h4>
                {harvest.field.name}
              </h4>

              <p>
                {harvest.availableQuantity} {details.unitMeasure.abbreviation}
              </p>
            </ItemDetail>
          ))}
        </Wrapper>
      ))}
    </div>
  )
}

export default StockItemDetail