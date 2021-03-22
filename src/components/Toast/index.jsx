import React, { useEffect, useRef } from 'react'
import { useToast } from '../../hooks/Toast/toast'

import { FiX, FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'
import { Wrapper, IconWrapper, ContentWrapper, Title, Description, CloseButton, Bar } from './styles'

const Toast = ({ id, type, title, description }) => {
  const { removeToast } = useToast()
  const barRef = useRef(null)
  const toastRef = useRef(null)

  const icons = {
    success: <FiCheckCircle size={20} />,
    error: <FiAlertCircle size={20} />,
    warning: <FiAlertTriangle size={20} />,
    info: <FiInfo size={20} />
  }

  useEffect(() => {
    barRef.current.addEventListener('animationend', () => {
      toastRef.current.style.animationPlayState = 'running'

      // setTimeout(() => { removeToast(id) }, 400)
    })

    toastRef.current.addEventListener('animationend', () => {
      setTimeout(() => { removeToast(id) }, 400)
    })
  }, [removeToast, id, barRef])

  return (
    <Wrapper ref={toastRef} type={type}>
      <IconWrapper>
        {icons[type]}
      </IconWrapper>

      <ContentWrapper>
        <Title>
          {title}
        </Title>

        <Description>
          {description}
        </Description>
      </ContentWrapper>

      <CloseButton onClick={() => removeToast(id)}>
        <FiX size={20} />
      </CloseButton>

      <Bar ref={barRef} />
    </Wrapper>
  )
}

export default Toast