import { createContext, useContext, useState } from "react";

const GlobalContext = createContext({})

const GlobalProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  
  const setCartData = (data) => {
    setCart(data)
  }

  return (
    <GlobalContext.Provider value={{ cart, setCartData }}>
      {children}
    </GlobalContext.Provider>
  )
}

const useGlobal = () => {
  return useContext(GlobalContext)
}

export {
  GlobalProvider,
  useGlobal
}