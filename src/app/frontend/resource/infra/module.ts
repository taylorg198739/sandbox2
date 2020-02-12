/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../common/components/module';
import {SharedModule} from '../../shared.module';
import {InfraComponent} from './component';
import {InfraRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, InfraRoutingModule],
  declarations: [InfraComponent],
})
export class InfraModule {}
