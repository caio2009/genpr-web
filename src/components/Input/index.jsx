import React, { useState, useEffect } from 'react'

import { InputContainer, ErrorContainer, Line } from './styles'

const Input = React.forwardRef(({ 
  name, 
  label, 
  defaultValue, 
  error, 
  onFocus, 
  onBlur, 
  onChange, 
  inputMode = 'text', 
  decimal = false, 
  formatValue, 
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
    if (_inputMode === 'text') {
      onChange(e.target.value)
      return
    }

    if (_inputMode === 'numeric') {
      let value = e.target.value

      if (value && e.nativeEvent.data) {
        const match = value[value.length - 1].match(/[0-9]/)

        if (match) {
          if (decimal) {
            let characters = value.split('')
  
            if (characters.length >= 5) {
              const temp = characters[characters.length - 4]
              characters[characters.length - 4] = characters[characters.length - 3]
              characters[characters.length - 3] = temp
  
              if (characters[0] === '0') characters.splice(0, 1)
            } else {
              characters = ['0', '.', '0', ...characters]
            }
  
            value = characters.join('')
            e.target.value = value
          }

          onChange(value)
        } else {
          e.target.value = value.substring(0, value.length - 1)
          onChange(value.substring(0, value.length - 1))
        }
      } else {
        if (decimal) {
          let characters = value.split('')
  
          const temp = characters[characters.length - 3]
          characters[characters.length - 3] = characters[characters.length - 2]
          characters[characters.length - 2] = temp
  
          if (characters[0] === '.') characters = ['0', ...characters]
  
          value = characters.join('')
          e.target.value = value
        }

        onChange(value)
      }
    }
  }

  const handleClick = (e) => {
    if (_inputMode) {
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