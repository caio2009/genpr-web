import React from 'react';

import GlobalStyle from './styles/global';
import AppProvider from './hooks';
import Header from './components/Header';
import Drawer from './components/Drawer';

function App() {
  return (
    <AppProvider>
      <Header />
      <Drawer />

      <GlobalStyle />
    </AppProvider>
  );
}

export default App;