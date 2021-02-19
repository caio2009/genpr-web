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

import BeforeCreateHarvest from '@pages/Harvest/BeforeCreateHarvest'
import CreateHarvest from '@pages/Harvest/CreateHarvest'

import Stock from '@pages/Stock'

import BuildOrder from '@pages/Order/BuildOrder'
import FinishOrder from '@pages/Order/FinishOrder'

import CustomerList from '@pages/Customer/CustomerList'

import DeliveryPlaceList from '@pages/DeliveryPlace/DeliveryPlaceList'

const Routes = () => {
  return (
    <Switch>
      <Route path="/" component={Home} exact />

      <Route path="/propriedades-rurais" component={RuralPropertyList} exact />

      <Route path="/culturas" component={CultivationList} exact />

      <Route path="/classificacoes" component={ClassificationList} exact />

      <Route path="/unidades-medida" component={UnitMeasureList} exact />

      <Route path="/propriedades-rurais/gerenciar/escolher" component={BeforeManageRP} />
      <Route path="/propriedades-rurais/gerenciar/:id" component={ManageRP} />

      <Route path="/talhoes/gerenciar/:id" component={ManageField} />

      <Route path="/colheitas/propriedades-rurais/escolher" component={BeforeCreateHarvest} />
      <Route path="/colheitas/talhoes/escolher" component={BeforeCreateHarvest} />
      <Route path="/colheitas/criar" component={CreateHarvest} />

      <Route path="/estoque" component={Stock} />

      <Route path="/vendas/criar" component={BuildOrder} />
      <Route path="/vendas/finalizar" component={FinishOrder} />

      <Route path="/clientes" component={CustomerList} exact />

      <Route path="/locais-entrega" component={DeliveryPlaceList} exact />
    </Switch>
  )
}

export default Routes