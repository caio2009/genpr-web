import React, { useCallback, useEffect, useRef } from 'react'

// import { ListItem } from '../../styles/components'
import { LongPressListItem as LongPressListItemContainer } from './styles'

const LongPressListItem = ({ children, onLongPress, customOnClick, isSelected, ...rest }) => {
  const ref = useRef(null)

  let pressTime = null
  let pressTimeout = null
  let rippleTimeout = null

  const onMouseDown = () => {
    pressTime = new Date().getTime()

    rippleTimeout = setTimeout(() => {
      ref.current.classList.add('ripple')
    }, 100)

    pressTimeout = setTimeout(() => {
      onLongPress()
      clearTimeout(pressTimeout)
    }, 400)
  }

  const onMouseUp = () => {
    clearTimeout(rippleTimeout)
    clearTimeout(pressTimeout)
  }

  const onMouseLeave = () => {
    clearTimeout(rippleTimeout)
    clearTimeout(pressTimeout)
  }

  const onTouchStart = () => {
    pressTime = new Date().getTime()

    rippleTimeout = setTimeout(() => {
      ref.current.classList.add('ripple')
    }, 100)

    pressTimeout = setTimeout(() => {
      onLongPress()
      clearTimeout(pressTimeout)
    }, 400)
  }

  const onTouchEnd = () => {
    clearTimeout(rippleTimeout)
    clearTimeout(pressTimeout)
  }

  const onClick = () => {
    const now = new Date().getTime()

    if (now - pressTime < 100) { 
      ref.current.classList.remove('ripple')
      customOnClick()
    }
  }

  const handleTouchmove = useCallback(() => {
    clearTimeout(rippleTimeout)
    clearTimeout(pressTimeout)
  }, [pressTimeout, rippleTimeout])

  useEffect(() => {
    window.addEventListener('touchmove', handleTouchmove, true)

    return () => {
      window.removeEventListener('touchmove', handleTouchmove)
    }
  }, [handleTouchmove])

  const bind = {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onClick
  }
 
  return (
    <LongPressListItemContainer ref={ref} isSelected={isSelected} {...bind} {...rest}>
      {children}
    </LongPressListItemContainer>
  )
}

export default LongPressListItem