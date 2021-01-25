import React from 'react'

import { Button as ButtonElement } from './styles'

const Button = ({ children, full = false, ...rest }) => {
  return (
    <ButtonElement isFull={full} {...rest}>
      {children}
    </ButtonElement>
  )
}

export default Button