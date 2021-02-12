import React, { useCallback, useEffect, useState } from 'react'

import api from '@services/api'

import { Subtitle, FlexRow } from '@styles/components'
import { Wrapper, ItemDetail } from './styles'

const StockItemDetail = ({ item }) => {
  const [ruralProperties, setRuralProperties] = useState([])
  const unitMeasureAbbreviation = item?.unitMeasure.abbreviation

  const loadRuralProperties = useCallback(async () => {
    if (item?.fields) {
      const res = await api.get('ruralProperties')
      setRuralProperties(res.data.filter(x => item.fields.find(y => y.ruralPropertyId === x.id)))
    }
  }, [item])

  useEffect(() => {
    loadRuralProperties()
  }, [item, loadRuralProperties])

  return (
    <div>
      <Subtitle>
        Origem
      </Subtitle>

      {ruralProperties.length > 0 && ruralProperties.map((rp, index) => (
        <Wrapper key={index}>
          <FlexRow justifyContent="space-between">
            <h4>
              {rp.name}
            </h4>

            <p>
              Total: {item?.fields && item.fields.filter(item => item.ruralPropertyId === rp.id).map(item => item.availableQuantity).reduce((prev, curr) => prev + curr, 0)} {unitMeasureAbbreviation}
            </p>
          </FlexRow>

          {item?.fields && item.fields.filter(item => item.ruralPropertyId === rp.id).map((item, index) => (
            <ItemDetail key={index}>
              <h4>
                {item.name}
              </h4>

              <p>
                {item.availableQuantity} {unitMeasureAbbreviation}
              </p>
            </ItemDetail>
          ))}
        </Wrapper>
      ))}
    </div>
  )
}

export default StockItemDetail