import React from 'react'
import { createPortal } from 'react-dom'

import { Wrapper } from './styles'
import Toast from '@components/Toast'

const ToastContainer = ({ toasts }) => {
  return createPortal(
    <Wrapper>
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          description={toast.description}
        />
      ))}
    </Wrapper>, document.body
  )
}

export default ToastContainer