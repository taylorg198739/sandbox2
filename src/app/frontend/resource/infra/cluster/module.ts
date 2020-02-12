/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../../common/components/module';
import {SharedModule} from '../../../shared.module';

import {ActionbarComponent} from './detail/actionbar/component';
import {ClusterDetailComponent} from './detail/component';
import {ClusterListComponent} from './list/component';
import {ClusterRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, ClusterRoutingModule],
  declarations: [ClusterListComponent, ClusterDetailComponent, ActionbarComponent],
})
export class ClusterModule {}
