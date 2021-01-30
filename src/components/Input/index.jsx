import React, { useState, useEffect } from 'react'

import { InputContainer, ErrorContainer, Line } from './styles'

const Input = React.forwardRef(({ name, label, defaultValue, error, onFocus, onBlur, onChange, inputMode = 'text', ...rest }, ref) => {
  const [focus, setFocus] = useState(false)
  const [_inputMode, setInputMode] = useState(inputMode)

  const handleFocus = (e) => {
    if (onFocus) onFocus(e)
    setFocus(true)
  }

  const handleBlur = (e) => {
    if (onBlur) onBlur(e)
    !e.target.value && setFocus(false)
  }

  const handleChange = (e) => {
    if (_inputMode === 'text') {
      onChange(e.target.value)
      return
    }

    if (_inputMode === 'numeric') {
      const match = e.target.value.match(/^\d*\.?\d*$/)

      if (match) {
        onChange(match[0])
      } else {
        onChange('')
      }
    }
  }

  useEffect(() => {
    (!!defaultValue || defaultValue === 0) && setFocus(true)
  }, [defaultValue])

  useEffect(() => {
    setInputMode(inputMode)
  }, [inputMode])

  return (
    <InputContainer focus={focus} error={error}>
      <label htmlFor={name}>{label}</label>

      <input 
        ref={ref}
        id={name}
        name={name}
        defaultValue={defaultValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />

      <Line focus={focus} error={error}></Line>

      <ErrorContainer>
        {error}
      </ErrorContainer>
    </InputContainer>
  )
})

export default Input