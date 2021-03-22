import React from 'react'
import { useToast } from '@hooks/Toast/toast'

import { Wrapper } from './styles'
import Toast from '@components/Toast'

const ToastContainer = () => {
  const { toasts } = useToast()

  return (
    <Wrapper>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          description={toast.description}
        />
      ))}
    </Wrapper>
  )
}

export default ToastContainer