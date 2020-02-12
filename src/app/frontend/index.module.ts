// Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.

import {HttpClientModule} from '@angular/common/http';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {ChromeModule} from './chrome/module';
import {CoreModule} from './core.module';
import {GlobalErrorHandler} from './error/handler';
import {RootComponent} from './index.component';
import {routes} from './index.routing';
import {LoginModule} from './login/module';
import {GestureConfig} from '@angular/material/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TopologyModule} from 'topology/module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    ChromeModule,
    LoginModule,
    NgbModule,
    TopologyModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  providers: [
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
  ],
  declarations: [RootComponent],
  bootstrap: [RootComponent],
})
export class RootModule {}
