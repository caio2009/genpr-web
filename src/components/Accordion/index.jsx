import React, { useState } from 'react'

import { FiChevronRight, FiChevronDown } from 'react-icons/fi'
import { AccordionContainer, AccordionButton, AccordionPanel } from './styles'

const Accordion = ({ title, content }) => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <AccordionContainer>
      <AccordionButton onClick={() => setIsOpened(!isOpened)}>
        <span>{title}</span>

        {isOpened ? <FiChevronDown /> : <FiChevronRight />}
      </AccordionButton>

      <AccordionPanel show={isOpened}>
        {content}
      </AccordionPanel>
    </AccordionContainer>
  )
}

export default Accordion