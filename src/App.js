import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';

import GlobalStyle from './styles/global';
import AppProvider from './hooks';
import Header from './components/Header';
import Drawer from './components/Drawer';

function App() {
  return (
    <Router>
      <AppProvider>
        <Header />
        <Drawer />
        <Routes />
      </AppProvider>

      <GlobalStyle />
    </Router>
  );
}

export default App;