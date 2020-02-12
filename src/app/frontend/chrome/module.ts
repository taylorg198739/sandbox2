/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {NgModule} from '@angular/core';

import {ComponentsModule} from '../common/components/module';
import {GuardsModule} from '../common/services/guard/module';
import {SharedModule} from '../shared.module';

import {ChromeComponent} from './component';
import {NavModule} from './nav/module';
import {NotificationsComponent} from './notifications/component';
import {ChromeRoutingModule} from './routing';
import {SearchComponent} from './search/component';
import {UserPanelComponent} from './userpanel/component';

@NgModule({
  imports: [SharedModule, ComponentsModule, NavModule, ChromeRoutingModule, GuardsModule],
  declarations: [ChromeComponent, SearchComponent, NotificationsComponent, UserPanelComponent],
})
export class ChromeModule {}
