import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import ChooseRP from '@components/Containers/ChooseRP'
import ChooseField from '@components/Containers/ChooseField'

const BeforeCreateProduction = () => {
  const history = useHistory()
  const location = useLocation()

  const search = useLocation().search
  const ruralPropertyId = new URLSearchParams(search).get('rp')

  const handleChooseRPChange = (id) => {
    history.push(`/producoes/talhoes/escolher?rp=${id}`)
  }

  const handleChooseFieldChange = (id) => {
    history.push(`/producoes/criar?talhao=${id}`)
  }

  return (
    <>
      { location.pathname.match(/propriedades-rurais/g) && <ChooseRP onChange={handleChooseRPChange} />}
      { location.pathname.match(/talhoes/g) && <ChooseField ruralPropertyId={ruralPropertyId} onChange={handleChooseFieldChange} />}
    </>
  )
}

export default BeforeCreateProduction