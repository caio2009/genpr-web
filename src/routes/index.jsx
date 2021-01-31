import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '@pages/Home'

import RuralPropertyList from '@pages/RuralProperty/RuralPropertyList'

import CultivationList from '@pages/Cultivation/CultivationList'

import ClassificationList from '@pages/Classification/ClassificationList'

import UnitMeasureList from '@pages/UnitMeasure/UnitMeasureList'

const Routes = () => {
  return (
    <Switch>
      <Route path="/" component={Home} exact />

      <Route path="/propriedades-rurais" component={RuralPropertyList} exact />

      <Route path="/culturas" component={CultivationList} exact />

      <Route path="/classificacoes" component={ClassificationList} exact />

      <Route path="/unidades-medida" component={UnitMeasureList} />
    </Switch>
  )
}

export default Routes