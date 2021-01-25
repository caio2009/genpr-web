import React, { useState, useEffect } from 'react'

import { SelectContainer, InputContainer, Label, Input, Line, ErrorContainer, OptionsContainer, Option } from './styles'

const Select = ({ name, label, options, value, defaultValue, error, ...rest }) => {
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
    value = selected
    setInnerValue(value)
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

  return (
    <SelectContainer {...rest} tabIndex={1} onBlur={handleBlur}>
      <InputContainer focus={focus} onClick={handleClick}>
        <Label focus={focus} error={error}>
          {label}
        </Label>

        <Input error={error}>
          {(!!defaultValue && !innerValue) && options.find(option => option.value === defaultValue).label}
          {!!innerValue && options.find(option => option.value === innerValue).label}
        </Input>

        <Line focus={focus} error={error}></Line>

        <ErrorContainer>
          {error}
        </ErrorContainer>
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
}

export default Select;