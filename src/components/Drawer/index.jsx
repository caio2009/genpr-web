import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useDrawer } from '../../hooks/drawer'

import { Container, DrawerContainer, Item } from './styles'

const Drawer = () => {
  const { isOpened, toggleDrawer } = useDrawer();

  const history = useHistory();

  const drawerRef = useRef(null)

  const goTo = (to) => {
    toggleDrawer(false);
    history.push(to);
  }

  useEffect(() => {
    if (isOpened) {
      drawerRef.current.style.maxHeight = `${drawerRef.current.scrollHeight}px`
    } else {
      drawerRef.current.style.maxHeight = null
    }
  }, [isOpened])

  const items = [
    { text: 'Início', to: '/' },
    { text: 'Propriedades Rurais', to: '/propriedades-rurais' },
    { text: 'Colheitas', to: '/' },
    { text: 'Culturas', to: '/culturas' },
    { text: 'Classificações', to: '/classificacoes' },
    { text: 'Unidades de Medida', to: '/unidades-medida' },
    { text: 'Estoque', to: '/estoque' },
    { text: 'Vendas', to: '/vendas' },
    { text: 'Clientes', to: '/clientes' },
    { text: 'Locais de entrega', to: '/locais-entrega' }
  ]

  return (
    <Container show={isOpened}>
      <DrawerContainer ref={drawerRef}>
        {items.map((item, index) => (
          <Item key={index} onClick={() => goTo(item.to)}>{item.text}</Item>
        ))}
      </DrawerContainer>
    </Container>
  )
}

export default Drawer;