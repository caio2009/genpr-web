import React, { useState, useEffect } from 'react'

import { SelectContainer, InputContainer, Label, Input, Line, ErrorContainer, OptionsContainer, Option } from './styles'

const Select = React.forwardRef(({ name, label, options, defaultValue, error, onChange, ...rest }, ref) => {
  const [innerValue, setInnerValue] = useState(null)
  const [focus, setFocus] = useState(false)
  const [showOptionsContainer, setShowOptionsContainer] = useState(false)

  const handleClick = () => {
    setFocus(true)
    toggleOptionsContainer()
  }

  const handleBlur = () => {
    !innerValue && setFocus(false)
    toggleOptionsContainer(false)
  }

  const handleOptionClick = (selected) => {
    toggleOptionsContainer()
    setInnerValue(selected)
  }

  const toggleOptionsContainer = (value = undefined) => {
    if (value !== undefined) {
      setShowOptionsContainer(value)
      return
    }
    setShowOptionsContainer(!showOptionsContainer)
  }

  useEffect(() => {
    setInnerValue(defaultValue)
    !!defaultValue && setFocus(true)
  }, [defaultValue])

  useEffect(() => {
    onChange(innerValue)
  }, [onChange, innerValue])

  return (
    <SelectContainer tabIndex={1} onBlur={handleBlur}>
      <input ref={ref} name={name} type="hidden" defaultValue={defaultValue} {...rest} />

      <InputContainer focus={focus} onClick={handleClick}>
        <Label focus={focus} error={error}>
          {label}
        </Label>

        <Input error={error}>
          {(!!defaultValue && !innerValue) && options.find(option => option.value === defaultValue)?.label}
          {!!innerValue && options.find(option => option.value === innerValue)?.label}
        </Input>

        <Line focus={focus} error={error}></Line>

        {error &&
          <ErrorContainer>
            {error.message}
          </ErrorContainer>}
      </InputContainer>

      <OptionsContainer show={showOptionsContainer}>
        {options.map(option => (
          <Option
            key={option.value}
            value={option.value}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </Option>
        ))}
      </OptionsContainer>
    </SelectContainer>
  )
})

export default Select;