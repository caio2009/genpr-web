import React, { createContext, useContext, useState } from 'react'

import Modal from '@components/Modal'

const ModalContext = createContext(null)

const ModalProvider = ({ children }) => {
  const [data, setData] = useState([])

  const openModal = ({ id, title, content, actions, fullPage, hasHeader }) => {
    const newModal = { id, title, content, actions, fullPage, hasHeader }

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
      {data.map(modal => (
        <Modal
          key={modal.id}
          show={true}
          closeModal={() => closeModal(modal.id)}
          title={modal.title}
          content={modal.content}
          actions={modal.actions}
          fullPage={modal.fullPage}
          hasHeader={modal.hasHeader !== undefined ? modal.hasHeader : true}
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