import React from 'react'

import { DialogOverlay, Centralizer, Dialog as Wrapper, Option, Title } from './styles'

const SelectDialog = ({ show = false, title = 'Selecione uma opção', options = [], onSelected, closeDialog }) => {
  const stopPropagation = (e) => {
    e.stopPropagation()
  }

  const handleOptionClick = (value) => {
    onSelected(value)
    closeDialog()
  }

  return (
    <DialogOverlay show={show} onClick={closeDialog}>
      <Centralizer>
        <Wrapper onClick={stopPropagation}>
          <Title>
            {title}
          </Title>

          {options.map((option, index) => (
            <Option key={index} value={option.value} onClick={() => handleOptionClick(options[index].value)}>
              {option.label}
            </Option>
          ))}
        </Wrapper>
      </Centralizer>
    </DialogOverlay>
  )
}

export default SelectDialog