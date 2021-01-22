import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDrawer } from '../../hooks/drawer'

import { Container, Item } from './styles'

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
      {items.map((item, index) => (
        <Item key={index} onClick={() => goTo(item.path)}>{item.text}</Item>
      ))}
    </Container>
  )
}

export default Drawer;