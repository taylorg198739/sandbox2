/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {TopologyComponent} from './components/topology/topology.component';

export const TOPOLOGY_ROUTE: Route = {
  path: '',
  component: TopologyComponent,
  data: {
    breadcrumb: 'Topology',
  },
};

@NgModule({
  imports: [RouterModule.forChild([TOPOLOGY_ROUTE])],
  exports: [RouterModule],
})
export class TopologyRoutingModule {}
