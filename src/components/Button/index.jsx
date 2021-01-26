import React from 'react'

import { Button as ButtonElement } from './styles'

const Button = ({ children, type = 'button', full = false, transparent = false, ...rest }) => {
  return (
    <ButtonElement type={type} isFull={full} isTransparent={transparent} {...rest}>
      {children}
    </ButtonElement>
  )
}

export default Button