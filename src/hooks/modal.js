import { useState } from "react"

const useModal = () => {
  const [modals, setModals] = useState({})

  const registerModal = (name) => {
    if (typeof name === 'string') {
      const newModals = {...modals}
      newModals[name] = false
      setModals(newModals)
      return
    }

    if (name instanceof Array) {
      const newModals = {...modals}
      for (let n of name) {
        newModals[n] = false
      }
      setModals(newModals)
    }
  }

  const toggleModal = (name) => {
    if (modals[name] === undefined) throw new Error(`Modal "${name}" does not exist`)

    const newModals = {...modals}
    newModals[name] = !newModals[name]
    setModals(newModals)
  }

  const isShowing = (name) => {
    if (modals[name] === undefined) return false

    return modals[name]
  }

  return {
    registerModal,
    toggleModal,
    isShowing
  }
}

export default useModal