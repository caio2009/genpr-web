import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDrawer } from '../../hooks/drawer'

import { Container, DrawerContainer, Item } from './styles'

const Drawer = () => {
  const { isOpened, toggleDrawer } = useDrawer();

  const history = useHistory();

  const goTo = (path) => {
    toggleDrawer(false);
    history.push(path);
  }

  const items = [
    { text: 'Início', path: '/' },
    { text: 'Propriedades Rurais', path: '/propriedades-rurais' },
    { text: 'Produção', path: '/' },
    { text: 'Culturas', path: '/' },
    { text: 'Classificações', path: '/' },
    { text: 'Unidades de Medida', path: '/' }
  ]

  return (
    <Container show={isOpened}>
      <DrawerContainer>
        {items.map((item, index) => (
          <Item key={index} onClick={() => goTo(item.path)}>{item.text}</Item>
        ))}
      </DrawerContainer>
    </Container>
  )
}

export default Drawer;