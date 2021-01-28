import React, { useState, useEffect } from 'react'

import { InputContainer, ErrorContainer, Line } from './styles'

const Input = React.forwardRef(({ name, label, defaultValue, error, onFocus, onBlur, onChange, ...rest }, ref) => {
  const [focus, setFocus] = useState(false)

  const handleFocus = (e) => {
    if (onFocus) onFocus(e)
    setFocus(true)
  }

  const handleBlur = (e) => {
    if (onBlur) onBlur(e)
    !e.target.value && setFocus(false)
  }

  useEffect(() => {
    (!!defaultValue || defaultValue === 0) && setFocus(true)
  }, [defaultValue])

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
        onChange={e => onChange(e.target.value)}
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