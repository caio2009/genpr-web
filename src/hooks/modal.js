import React, { createContext, useContext, useState } from 'react'

import Modal from '@components/Modal'

const ModalContext = createContext(null)

const ModalProvider = ({ children }) => {
  const [data, setData] = useState([])

  const openModal = ({ id, title, content, actions, fullPage }) => {
    const newModal = { id, title, content, actions, fullPage }

    setData(state => [...state, newModal])
  }

  const closeModal = (id) => {
    setData(state => state.filter(modal => modal.id !== id))
  }

  const closeAllModals = () => {
    setData([])
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {data.map(model => (
        <Modal
          key={model.id}
          show={true}
          closeModal={() => closeModal(model.id)}
          title={model.title}
          content={model.content}
          actions={model.actions}
          fullPage={model.fullPage}
        />
      ))}
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