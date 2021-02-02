import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '@pages/Home'

import RuralPropertyList from '@pages/RuralProperty/RuralPropertyList'

import CultivationList from '@pages/Cultivation/CultivationList'

import ClassificationList from '@pages/Classification/ClassificationList'

import UnitMeasureList from '@pages/UnitMeasure/UnitMeasureList'

import BeforeManageRP from '@pages/RuralProperty/BeforeManageRP'
import ManageRP from '@pages/RuralProperty/ManageRP'

import ManageField from '@pages/Field/ManageField'

import BeforeCreateProduction from '@pages/Production/BeforeCreateProduction'
import CreateProduction from '@pages/Production/CreateProduction'

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

      <Route path="/talhoes/gerenciar/:id" component={ManageField} />

      <Route path="/producoes/escolher" component={BeforeCreateProduction} />
      <Route path="/producoes/criar" component={CreateProduction} />
    </Switch>
  )
}

export default Routes