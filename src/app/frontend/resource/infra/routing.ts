/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {InfraComponent} from './component';

export const INFRA_ROUTE: Route = {
  path: '',
  component: InfraComponent,
  data: {
    breadcrumb: 'Infrastructure',
    link: ['', 'infra'],
  },
};

@NgModule({
  imports: [RouterModule.forChild([INFRA_ROUTE])],
  exports: [RouterModule],
})
export class InfraRoutingModule {}
