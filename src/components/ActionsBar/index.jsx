import React from 'react'

import { ActionsBarContainer } from './styles'

const ActionsBar = ({ children, show }) => {
  return (
    <ActionsBarContainer show={show}>
      {children}
    </ActionsBarContainer>
  )
}

export default ActionsBar