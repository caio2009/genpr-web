import React, { useState, useEffect, useRef } from 'react'

import { AutocompleteContainer, InputContainer, Label, Input, Line, ErrorContainer, OptionsContainer, Option } from './styles'

import uppercase from '../Input/uppercase'

const Autocomplete = React.forwardRef(({ 
  name, 
  label, 
  options, 
  defaultValue = '', 
  error, 
  onBlur, 
  onChange,
  uppercase: isUppercase, 
  ...rest 
}, ref) => {
  const inputRef = useRef(null)

  const [innerValue, setInnerValue] = useState('')
  const [focus, setFocus] = useState(false)

  const handleClick = () => {
    inputRef.current.focus()
    setFocus(true)
  }

  const handleBlur = () => {
    if (onBlur) onBlur()
    !innerValue && setFocus(false)
  }

  const handleChange = (e) => {
    let value = e.target.value

    if (isUppercase) {
      value = uppercase(value)
    }

    if (value !== e.target.value) {
      e.target.value = value
    }

    setInnerValue(value)
    onChange(value, { isSelected: false })
  }

  const handleOptionClick = (selected) => {
    setInnerValue(selected)
    inputRef.current.value = selected
    onChange(selected, { isSelected: true })

    // inputRef.current.blur()
  }

  useEffect(() => {
    setInnerValue(defaultValue)
    !!defaultValue && setFocus(true)
  }, [defaultValue])

  return (
    <AutocompleteContainer tabIndex={1} onBlur={handleBlur}>
      <input ref={ref} name={name} type="hidden" value={innerValue || defaultValue} {...rest} />

      <InputContainer focus={focus} onClick={handleClick}>
        <Label focus={focus} error={error}>
          {label}
        </Label>

        <Input 
          ref={inputRef} 
          name={name} 
          type="text" 
          defaultValue={defaultValue}
          onChange={handleChange}
          {...rest} 
        />

        <Line focus={focus} error={error}></Line>

        {error &&
          <ErrorContainer>
            {error.message}
          </ErrorContainer>}
      </InputContainer>

      <OptionsContainer show={true}>
        {options.map((option, index) => (
          <Option
            key={index}
            onClick={() => handleOptionClick(option.label)}
          >
            {option.label}
          </Option>
        ))}
      </OptionsContainer>
    </AutocompleteContainer>
  )
})

export default Autocomplete