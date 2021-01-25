import React from 'react'
import { useHistory } from 'react-router-dom'

import Button from '../Button'

const ButtonLink = ({ children, to, ...rest }) => {
  const history = useHistory()

  const handleClick = () => {
    history.push(to)
  }

  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  )
}

export default ButtonLink