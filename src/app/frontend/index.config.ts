// Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.

import {InjectionToken} from '@angular/core';
import {MatTooltipDefaultOptions} from '@angular/material';

export let CONFIG_DI_TOKEN = new InjectionToken<Config>('kd.config');

export interface Config {
  authTokenCookieName: string;
  skipLoginPageCookieName: string;
  csrfHeaderName: string;
  authTokenHeaderName: string;
  defaultNamespace: string;
}

export const CONFIG: Config = {
  authTokenCookieName: 'jweToken',
  authTokenHeaderName: 'jweToken',
  csrfHeaderName: 'X-CSRF-TOKEN',
  skipLoginPageCookieName: 'skipLoginPage',
  defaultNamespace: 'default',
};

// Override default material tooltip values.
export const KD_TOOLTIP_DEFAULT_OPTIONS: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 0,
  touchendHideDelay: 0,
};
