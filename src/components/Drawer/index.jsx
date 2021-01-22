import React from 'react'
import { useDrawer } from '../../hooks/drawer'

import { Container, Item } from './styles'

const Drawer = ({ show = false }) => {
  const { isOpened } = useDrawer();

  return (
    <Container show={isOpened}>
      <Item>Propriedade Rural</Item>
      <Item>Produção</Item>
      <Item>Cultura</Item>
      <Item>Classificação</Item>
      <Item>Unidade de Medida</Item>
    </Container>
  )
}

export default Drawer;