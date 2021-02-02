import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '@pages/Home'

import RuralPropertyList from '@pages/RuralProperty/RuralPropertyList'

import CultivationList from '@pages/Cultivation/CultivationList'

import ClassificationList from '@pages/Classification/ClassificationList'

import UnitMeasureList from '@pages/UnitMeasure/UnitMeasureList'

import BeforeManageRP from '@pages/RuralProperty/BeforeManageRP'
import ManageRP from '@pages/RuralProperty/ManageRP'

const Routes = () => {
  return (
    <Switch>
      <Route path="/" component={Home} exact />

      <Route path="/propriedades-rurais" component={RuralPropertyList} exact />

      <Route path="/culturas" component={CultivationList} exact />

      <Route path="/classificacoes" component={ClassificationList} exact />

      <Route path="/unidades-medida" component={UnitMeasureList} />

      <Route path="/propriedades-rurais/gerenciar/escolher" component={BeforeManageRP} />
      <Route path="/propriedades-rurais/gerenciar/:id" component={ManageRP} />
    </Switch>
  )
}

export default Routes