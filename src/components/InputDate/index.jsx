import React, { useEffect, useRef } from 'react'

import Input from '../Input'

const InputDate = ({ defaultValue, ...rest }) => {
  const inputRef = useRef(null)

  const handleFocus = (e) => {
    e.target.type = 'date'
    e.target.focus()
  }

  const handleBlur = (e) => {
    if (!e.target.value) {
      e.target.type = 'text'
    }
  }

  useEffect(() => {
    if (defaultValue) {
      inputRef.current.type = 'date'
    }
  }, [defaultValue])

  return (
    <Input 
      ref={inputRef} 
      {...rest} 
      type="text" 
      defaultValue={defaultValue}
      onFocus={handleFocus} 
      onBlur={handleBlur} 
    />
  )
}

export default InputDate