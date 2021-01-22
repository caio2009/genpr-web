import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'

import RuralPropertyList from '../pages/RuralProperty/RuralPropertyList'

const Routes = () => {
  return (
    <Switch>
      <Route path="/" component={Home} exact />

      <Route path="/propriedades-rurais" component={RuralPropertyList} exact />
    </Switch>
  )
}

export default Routes