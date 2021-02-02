import React from 'react'
import { useHistory } from 'react-router-dom'

import ChooseRP from '@components/Containers/ChooseRP'

const BeforeManageRP = () => {
  const history = useHistory()

  const handleChange = (id) => {
    history.push(`/propriedades-rurais/gerenciar/${id}`)
  }
  
  return (
    <>
      <ChooseRP onChange={handleChange} />
    </>
  )
}

export default BeforeManageRP