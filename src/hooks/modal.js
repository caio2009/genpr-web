import React, { createContext, useContext, useState } from 'react'

import Modal from '@components/Modal'

const ModalContext = createContext(null)

const ModalProvider = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false) 
  const [data, setData] = useState({})

  const openModal = ({ title, content, actions, fullPage }) => {
    setData({ title, content, actions, fullPage })
    setIsOpened(true)
  }

  const closeModal = () => {
    setData({})
    setIsOpened(false)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <Modal 
        show={isOpened}
        closeModal={closeModal}
        title={data.title}
        content={data.content}
        actions={data.actions}
        fullPage={data.fullPage}
      />
      {children}
    </ModalContext.Provider>
  )
} 

const useModal = () => {
  return useContext(ModalContext)
}

export {
  ModalProvider,
  useModal
}