// Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.

import {Routes} from '@angular/router';
import {LoginGuard} from './common/services/guard/login';
import {LoginComponent} from './login/component';
import {TopologyComponent} from './topology/components/topology/topology.component';
import {TopologyDetailComponent } from './topology/components/topology-detail/topology-detail.component';
import {DashboardComponent} from './dashboard/component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'topology', component: TopologyComponent},
  {path: 'topology/:id', component: TopologyDetailComponent},
];
