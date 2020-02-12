/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {DashboardComponent} from './component';

export const DASHBOARD_ROUTE: Route = {
  path: '',
  component: DashboardComponent,
  data: {
    breadcrumb: 'Dashboard',
  },
};

@NgModule({
  imports: [RouterModule.forChild([DASHBOARD_ROUTE])],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
