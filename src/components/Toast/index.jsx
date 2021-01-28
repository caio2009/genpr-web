import React, { useEffect } from 'react'
import { useToast } from '../../hooks/Toast/toast'

import { FiX, FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'
import { Wrapper, IconWrapper, ContentWrapper, Title, Description, CloseButton } from './styles'

const Toast = ({ id, type, title, description }) => {
  const { removeToast } = useToast()

  const AUTO_REMOVE_TIME = 4 * 1000

  const icons = {
    success: <FiCheckCircle size={20} />,
    error: <FiAlertCircle size={20} />,
    warning: <FiAlertTriangle size={20} />,
    info: <FiInfo size={20} />
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id)
    }, AUTO_REMOVE_TIME)

    return () => {
      clearTimeout(timer)
    }
  }, [removeToast, id, AUTO_REMOVE_TIME])

  return (
    <Wrapper type={type}>
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
    </Wrapper>
  )
}

export default Toast