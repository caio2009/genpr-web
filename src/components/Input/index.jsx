import React, { useState, useEffect } from 'react'

import { InputContainer, ErrorContainer, Line } from './styles'

import onlyNumber from './onlyNumber'
import decimalMask from './decimalMask'
import phoneMask from './phoneMask'

const Input = React.forwardRef(({
  name,
  label,
  defaultValue,
  error,
  onFocus,
  onBlur,
  onChange,
  inputMode = 'text',
  decimalMask: isDecimalMask = false,
  phoneMask: isPhoneMask = false,
  ...rest
}, ref) => {
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
    let value = e.target.value

    if (_inputMode === 'numeric') {
      value = onlyNumber(e.target.value)
    }

    if (isDecimalMask) {
      if (e.nativeEvent.data) {
        value = decimalMask(value, { isBackspace: false })
      } else {
        value = decimalMask(value, { isBackspace: true })
      }
    }

    if (isPhoneMask && e.nativeEvent.data) {
      value = phoneMask(value)
    }

    if (e.target.value !== value) {
      e.target.value = value
    }

    onChange(value)
  }

  const handleClick = (e) => {
    if (_inputMode === 'numeric') {
      e.target.select()
    }
  }

  useEffect(() => {
    (!!defaultValue || defaultValue === 0) && setFocus(true)
  }, [defaultValue])

  useEffect(() => {
    setInputMode(inputMode)
  }, [inputMode])

  return (
    <InputContainer
      focus={focus}
      error={error}
    >
      <label htmlFor={name}>{label}</label>

      <input
        ref={ref}
        id={name}
        name={name}
        defaultValue={defaultValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={handleClick}
        inputMode={inputMode}
        {...rest}
      />

      <Line focus={focus} error={error}></Line>

      {error &&
        <ErrorContainer>
          {error.message}
        </ErrorContainer>}
    </InputContainer>
  )
})

export default Input