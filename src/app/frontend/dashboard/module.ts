/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {NgModule} from '@angular/core';
import {GaugeChartModule} from 'angular-gauge-chart'
import {ComponentsModule} from '../common/components/module';
import {SharedModule} from '../shared.module';
import {DashboardComponent} from './component';
import {DashboardRoutingModule} from './routing';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    DashboardRoutingModule,
    GaugeChartModule],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
