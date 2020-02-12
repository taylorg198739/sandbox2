/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {DEFAULT_ACTIONBAR} from '../../../common/components/actionbars/routing';

import {INFRA_ROUTE} from '../routing';

import {ClusterDetailComponent} from './detail/component';
import {ClusterListComponent} from './list/component';

const CLUSTER_LIST_ROUTE: Route = {
  path: '',
  component: ClusterListComponent,
  data: {
    breadcrumb: 'Clusters',
    parent: INFRA_ROUTE,
  },
};

const CLUSTER_DETAIL_ROUTE: Route = {
  path: ':resourceName',
  component: ClusterDetailComponent,
  data: {
    breadcrumb: '{{ resourceName }}',
    parent: CLUSTER_LIST_ROUTE,
  },
};

@NgModule({
  imports: [RouterModule.forChild([CLUSTER_LIST_ROUTE, CLUSTER_DETAIL_ROUTE, DEFAULT_ACTIONBAR])],
  exports: [RouterModule],
})
export class ClusterRoutingModule {}
