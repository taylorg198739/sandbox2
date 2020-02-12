// Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.

import {Inject, NgModule, Optional, SkipSelf} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

import {DialogsModule} from './common/dialogs/module';
import {GlobalServicesModule} from './common/services/global/module';
import {ResourceModule} from './common/services/resource/module';
import {CONFIG, CONFIG_DI_TOKEN} from './index.config';

@NgModule({
  providers: [{provide: CONFIG_DI_TOKEN, useValue: CONFIG}, CookieService],
  imports: [GlobalServicesModule, DialogsModule, ResourceModule],
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the RootModule */
  constructor(@Inject(CoreModule) @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in RootModule.');
    }
  }
}
