import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import ChooseRP from '@components/Containers/ChooseRP'
import ChooseField from '@components/Containers/ChooseField'

const BeforeCreateProduction = () => {
  const history = useHistory()

  const [container, setContainer] = useState('ChooseRP')
  const [ruralPropertyId, setRuralPropertyId] = useState(null)

  const handleChooseRPChange = (id) => {
    setRuralPropertyId(id)
    setContainer('ChooseField')
  }

  const handleChooseFieldChange = (id) => {
    history.push(`/producoes/criar?talhao=${id}`)
  }

  return (
    <>
      {container === 'ChooseRP' && <ChooseRP onChange={handleChooseRPChange} />}
      {container === 'ChooseField' && <ChooseField ruralPropertyId={ruralPropertyId} onChange={handleChooseFieldChange} />}
    </>
  )
}

export default BeforeCreateProduction