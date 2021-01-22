import React from 'react'
import { useDrawer } from '../../hooks/drawer';

import { FiMenu } from 'react-icons/fi';
import { Container, ToggleMenu, Logo } from './styles';

const Header = () => {
  const { toggleDrawer } = useDrawer();

  const handleToggle = () => {
    toggleDrawer()
  }

  return (
    <Container>
      <Logo>
        Asahi
      </Logo>

      <ToggleMenu onClick={handleToggle}>
        <FiMenu size={24} />
      </ToggleMenu>
    </Container>
  )
}

export default Header