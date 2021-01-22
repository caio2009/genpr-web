import React from 'react'
import { useDrawer } from '../../hooks/drawer';

import { FiMenu, FiX } from 'react-icons/fi';
import { Container, ToggleMenu, Logo } from './styles';

const Header = () => {
  const { isOpened, toggleDrawer } = useDrawer();

  const handleToggle = () => {
    toggleDrawer()
  }

  return (
    <Container>
      <Logo>
        Asahi
      </Logo>

      <ToggleMenu onClick={handleToggle}>
        {isOpened ? <FiX size={24} /> : <FiMenu size={24} />}
      </ToggleMenu>
    </Container>
  )
}

export default Header