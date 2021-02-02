import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDrawer } from '../../hooks/drawer'

import { Container, DrawerContainer, Item } from './styles'

const Drawer = () => {
  const { isOpened, toggleDrawer } = useDrawer();

  const history = useHistory();

  const goTo = (to) => {
    toggleDrawer(false);
    history.push(to);
  }

  const items = [
    { text: 'Início', to: '/' },
    { text: 'Propriedades Rurais', to: '/propriedades-rurais' },
    { text: 'Produção', to: '/' },
    { text: 'Culturas', to: '/culturas' },
    { text: 'Classificações', to: '/classificacoes' },
    { text: 'Unidades de Medida', to: '/unidades-medida' }
  ]

  return (
    <Container show={isOpened}>
      <DrawerContainer>
        {items.map((item, index) => (
          <Item key={index} onClick={() => goTo(item.to)}>{item.text}</Item>
        ))}
      </DrawerContainer>
    </Container>
  )
}

export default Drawer;