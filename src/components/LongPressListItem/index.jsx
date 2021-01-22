import React from 'react'

import { ListItem } from '../../styles/components'

const LongPressListItem = ({ children, onLongPress, customOnClick, isSelected, ...rest }) => {
  let pressTime = null
  let pressTimeout = null

  const onMouseDown = () => {
    pressTime = new Date().getTime()

    pressTimeout = setTimeout(() => {
      onLongPress()
      clearTimeout(pressTimeout)
    }, 200)
  }

  const onMouseUp = () => {
    clearTimeout(pressTimeout)
  }

  const onMouseLeave = () => {
    clearTimeout(pressTimeout)
  }

  const onTouchStart = () => {
    pressTime = new Date().getTime()

    pressTimeout = setTimeout(() => {
      onLongPress()
      clearTimeout(pressTimeout)
    }, 200)
  }

  const onTouchEnd = () => {
    clearTimeout(pressTimeout)
  }

  const onClick = () => {
    const now = new Date().getTime()

    if (now - pressTime < 200) customOnClick()
  }

  const bind = {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onClick
  }
 
  return (
    <ListItem isSelected={isSelected} {...bind} {...rest}>
      {children}
    </ListItem>
  )
}

export default LongPressListItem